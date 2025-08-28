import { supabaseAdmin } from '../config/supabase';
import { logger } from '../utils/logger';
import { Service, ServiceCategory, SearchFilters } from '../../../shared/types';

export class ServiceService {
  // Get all service categories
  static async getCategories(includeInactive = false) {
    let query = supabaseAdmin
      .from('service_categories')
      .select('*');

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Get services by category
  static async getServicesByCategory(categoryId: string, includeInactive = false) {
    let query = supabaseAdmin
      .from('services')
      .select(`
        *,
        service_categories (
          name,
          description,
          icon
        )
      `)
      .eq('category_id', categoryId);

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query.order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  // Search services with filters
  static async searchServices(filters: SearchFilters, page = 1, limit = 20) {
    let query = supabaseAdmin
      .from('services')
      .select(`
        *,
        service_categories (
          name,
          description,
          icon
        ),
        provider_services (
          provider_id,
          custom_price,
          is_available,
          providers (
            id,
            business_name,
            rating_average,
            total_reviews,
            verification_status,
            service_areas
          )
        )
      `, { count: 'exact' })
      .eq('is_active', true);

    // Apply filters
    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.price_min !== undefined) {
      query = query.gte('base_price', filters.price_min);
    }

    if (filters.price_max !== undefined) {
      query = query.lte('base_price', filters.price_max);
    }

    // Apply sorting
    const sortBy = filters.sort_by || 'name';
    const sortOrder = filters.sort_order === 'desc' ? false : true;

    if (sortBy === 'price') {
      query = query.order('base_price', { ascending: sortOrder });
    } else if (sortBy === 'name') {
      query = query.order('name', { ascending: sortOrder });
    }

    const offset = (page - 1) * limit;
    const { data, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Filter by provider availability and other criteria
    let filteredData = data || [];

    if (filters.rating_min !== undefined) {
      filteredData = filteredData.filter(service => 
        service.provider_services?.some(ps => 
          ps.providers?.rating_average && ps.providers.rating_average >= filters.rating_min!
        )
      );
    }

    if (filters.location) {
      filteredData = filteredData.filter(service =>
        service.provider_services?.some(ps =>
          ps.providers?.service_areas?.some(area =>
            area.toLowerCase().includes(filters.location!.toLowerCase())
          )
        )
      );
    }

    const totalPages = count ? Math.ceil(count / limit) : 0;

    return {
      data: filteredData,
      metadata: {
        page,
        limit,
        total: count || 0,
        totalPages,
      },
    };
  }

  // Get service by ID with providers
  static async getServiceById(serviceId: string) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select(`
        *,
        service_categories (
          name,
          description,
          icon
        ),
        provider_services (
          id,
          custom_price,
          is_available,
          providers (
            id,
            business_name,
            description,
            experience_years,
            rating_average,
            total_reviews,
            verification_status,
            service_areas,
            users (
              id,
              email,
              profiles (
                full_name,
                avatar_url
              )
            )
          )
        )
      `)
      .eq('id', serviceId)
      .eq('is_active', true)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  // Admin: Create new service
  static async createService(serviceData: {
    name: string;
    description: string;
    category_id: string;
    base_price: number;
    duration_minutes: number;
    image_url?: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .insert(serviceData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    logger.info(`Service created: ${serviceData.name}`);
    return data;
  }

  // Admin: Update service
  static async updateService(serviceId: string, updateData: Partial<Service>) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', serviceId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    logger.info(`Service updated: ${serviceId}`);
    return data;
  }

  // Admin: Delete service
  static async deleteService(serviceId: string) {
    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', serviceId);

    if (error) {
      throw new Error(error.message);
    }

    logger.info(`Service deleted: ${serviceId}`);
  }

  // Get popular services
  static async getPopularServices(limit = 10) {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select(`
        *,
        service_categories (name, icon),
        provider_services (count)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}
