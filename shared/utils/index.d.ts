export declare const USER_ROLES: {
    readonly CUSTOMER: "customer";
    readonly PROVIDER: "provider";
    readonly ADMIN: "admin";
};
export declare const BOOKING_STATUS: {
    readonly PENDING: "pending";
    readonly CONFIRMED: "confirmed";
    readonly IN_PROGRESS: "in_progress";
    readonly COMPLETED: "completed";
    readonly CANCELLED: "cancelled";
};
export declare const VERIFICATION_STATUS: {
    readonly PENDING: "pending";
    readonly VERIFIED: "verified";
    readonly REJECTED: "rejected";
};
export declare const API_ROUTES: {
    readonly AUTH: {
        readonly LOGIN: "/auth/login";
        readonly REGISTER: "/auth/register";
        readonly LOGOUT: "/auth/logout";
        readonly PROFILE: "/auth/profile";
    };
    readonly SERVICES: {
        readonly BASE: "/services";
        readonly CATEGORIES: "/services/categories";
    };
    readonly PROVIDERS: {
        readonly BASE: "/providers";
        readonly SEARCH: "/providers/search";
        readonly AVAILABILITY: "/providers/:id/availability";
    };
    readonly BOOKINGS: {
        readonly BASE: "/bookings";
        readonly USER_BOOKINGS: "/bookings/user";
        readonly PROVIDER_BOOKINGS: "/bookings/provider";
    };
    readonly REVIEWS: {
        readonly BASE: "/reviews";
        readonly PROVIDER_REVIEWS: "/reviews/provider/:id";
    };
};
export declare const formatCurrency: (amount: number, currency?: string) => string;
export declare const formatDate: (date: string | Date) => string;
export declare const formatTime: (time: string) => string;
export declare const formatDateTime: (date: string | Date, time: string) => string;
export declare const generateSlug: (text: string) => string;
export declare const truncateText: (text: string, maxLength: number) => string;
export declare const capitalizeFirst: (text: string) => string;
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPhone: (phone: string) => boolean;
export declare const calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
export declare const getDayName: (dayOfWeek: number) => string;
export declare const isTimeSlotAvailable: (startTime: string, endTime: string, bookingTime: string, bookingDuration: number) => boolean;
export declare const generateTimeSlots: (startTime: string, endTime: string, duration: number, interval?: number) => string[];
export declare const calculateBookingTotal: (basePrice: number, duration: number) => number;
export declare const getAverageRating: (reviews: Array<{
    rating: number;
}>) => number;
export declare const debounce: <T extends (...args: any[]) => any>(func: T, wait: number) => ((...args: Parameters<T>) => void);
export declare const throttle: <T extends (...args: any[]) => any>(func: T, wait: number) => ((...args: Parameters<T>) => void);
export declare const sleep: (ms: number) => Promise<void>;
export declare const retry: <T>(fn: () => Promise<T>, retries: number, delay?: number) => Promise<T>;
export declare class AppError extends Error {
    code: string;
    statusCode: number;
    details?: any | undefined;
    constructor(message: string, code: string, statusCode?: number, details?: any | undefined);
}
export declare const handleApiError: (error: any) => {
    message: string;
    code: string;
    statusCode: number;
};
//# sourceMappingURL=index.d.ts.map