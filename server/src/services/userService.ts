import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';
import { User, Provider } from '../../../shared/types';
import { RegisterForm } from '../../../shared/types';

export class UserService {
  static async createUser(userData: RegisterForm) {
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          role: userData.role,
        },
      });

      if (authError || !authData.user) {
        throw new Error(authError?.message || 'Failed to create user');
      }

      // Create user in users table
      const { error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email: userData.email,
          role: userData.role,
        });

      if (userError) {
        // Cleanup auth user if database insert fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        throw new Error(userError.message);
      }

      // Create user profile
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: authData.user.id,
          full_name: userData.full_name,
          phone: userData.phone,
        });

      if (profileError) {
        // Cleanup if profile creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        await supabaseAdmin.from('users').delete().eq('id', authData.user.id);
        throw new Error(profileError.message);
      }

      logger.info(`User created successfully: ${userData.email}`);
      return authData.user;
    } catch (error: any) {
      logger.error('Failed to create user:', error);
      throw error;
    }
  }

  static async getUserById(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        profiles (
          full_name,
          phone,
          avatar_url,
          created_at,
          updated_at
        )
      `)
      .eq('id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select(`
        *,
        profiles (
          full_name,
          phone,
          avatar_url,
          created_at,
          updated_at
        )
      `)
      .eq('email', email)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  static async updateProfile(userId: string, updateData: Partial<{
    full_name: string;
    phone: string;
    avatar_url: string;
  }>) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    logger.info(`Profile updated for user: ${userId}`);
    return data;
  }

  static async deleteUser(userId: string) {
    try {
      // Delete from profiles first (foreign key constraint)
      await supabaseAdmin.from('profiles').delete().eq('id', userId);
      
      // Delete from users table
      await supabaseAdmin.from('users').delete().eq('id', userId);
      
      // Delete from Supabase Auth
      await supabaseAdmin.auth.admin.deleteUser(userId);
      
      logger.info(`User deleted successfully: ${userId}`);
    } catch (error: any) {
      logger.error('Failed to delete user:', error);
      throw error;
    }
  }

  static async getAllUsers(page: number = 1, limit: number = 10, role?: string) {
    let query = supabaseAdmin
      .from('users')
      .select(`
        *,
        profiles (
          full_name,
          phone,
          avatar_url,
          created_at,
          updated_at
        )
      `, { count: 'exact' });

    if (role) {
      query = query.eq('role', role);
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      data: data || [],
      metadata: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    };
  }

  static async getUserStats() {
    const { data: stats, error } = await supabaseAdmin
      .rpc('get_user_stats');

    if (error) {
      logger.warn('Failed to get user stats:', error);
      return {
        total_users: 0,
        total_customers: 0,
        total_providers: 0,
        total_admins: 0,
      };
    }

    return stats;
  }
}
