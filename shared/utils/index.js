"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleApiError = exports.AppError = exports.retry = exports.sleep = exports.throttle = exports.debounce = exports.getAverageRating = exports.calculateBookingTotal = exports.generateTimeSlots = exports.isTimeSlotAvailable = exports.getDayName = exports.calculateDistance = exports.isValidPhone = exports.isValidEmail = exports.capitalizeFirst = exports.truncateText = exports.generateSlug = exports.formatDateTime = exports.formatTime = exports.formatDate = exports.formatCurrency = exports.API_ROUTES = exports.VERIFICATION_STATUS = exports.BOOKING_STATUS = exports.USER_ROLES = void 0;
exports.USER_ROLES = {
    CUSTOMER: 'customer',
    PROVIDER: 'provider',
    ADMIN: 'admin',
};
exports.BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};
exports.VERIFICATION_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
};
exports.API_ROUTES = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        PROFILE: '/auth/profile',
    },
    SERVICES: {
        BASE: '/services',
        CATEGORIES: '/services/categories',
    },
    PROVIDERS: {
        BASE: '/providers',
        SEARCH: '/providers/search',
        AVAILABILITY: '/providers/:id/availability',
    },
    BOOKINGS: {
        BASE: '/bookings',
        USER_BOOKINGS: '/bookings/user',
        PROVIDER_BOOKINGS: '/bookings/provider',
    },
    REVIEWS: {
        BASE: '/reviews',
        PROVIDER_REVIEWS: '/reviews/provider/:id',
    },
};
const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount);
};
exports.formatCurrency = formatCurrency;
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(new Date(date));
};
exports.formatDate = formatDate;
const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
};
exports.formatTime = formatTime;
const formatDateTime = (date, time) => {
    return `${(0, exports.formatDate)(date)} at ${(0, exports.formatTime)(time)}`;
};
exports.formatDateTime = formatDateTime;
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
};
exports.generateSlug = generateSlug;
const truncateText = (text, maxLength) => {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength).trim() + '...';
};
exports.truncateText = truncateText;
const capitalizeFirst = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};
exports.capitalizeFirst = capitalizeFirst;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidPhone = (phone) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};
exports.isValidPhone = isValidPhone;
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
            Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance * 100) / 100;
};
exports.calculateDistance = calculateDistance;
const getDayName = (dayOfWeek) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek] || 'Unknown';
};
exports.getDayName = getDayName;
const isTimeSlotAvailable = (startTime, endTime, bookingTime, bookingDuration) => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const booking = new Date(`2000-01-01T${bookingTime}:00`);
    const bookingEnd = new Date(booking.getTime() + bookingDuration * 60000);
    return booking >= start && bookingEnd <= end;
};
exports.isTimeSlotAvailable = isTimeSlotAvailable;
const generateTimeSlots = (startTime, endTime, duration, interval = 30) => {
    const slots = [];
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    let current = new Date(start);
    while (current < end) {
        const slotEnd = new Date(current.getTime() + duration * 60000);
        if (slotEnd <= end) {
            slots.push(current.toTimeString().slice(0, 5));
        }
        current = new Date(current.getTime() + interval * 60000);
    }
    return slots;
};
exports.generateTimeSlots = generateTimeSlots;
const calculateBookingTotal = (basePrice, duration) => {
    const hours = duration / 60;
    return Math.round(basePrice * hours * 100) / 100;
};
exports.calculateBookingTotal = calculateBookingTotal;
const getAverageRating = (reviews) => {
    if (reviews.length === 0)
        return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
};
exports.getAverageRating = getAverageRating;
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(null, args), wait);
    };
};
exports.debounce = debounce;
const throttle = (func, wait) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
};
exports.throttle = throttle;
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
exports.sleep = sleep;
const retry = async (fn, retries, delay = 1000) => {
    try {
        return await fn();
    }
    catch (error) {
        if (retries > 0) {
            await (0, exports.sleep)(delay);
            return (0, exports.retry)(fn, retries - 1, delay * 2);
        }
        throw error;
    }
};
exports.retry = retry;
class AppError extends Error {
    constructor(message, code, statusCode = 400, details) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
const handleApiError = (error) => {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
        };
    }
    if (error?.code) {
        return {
            message: error.message || 'Database error occurred',
            code: error.code,
            statusCode: 500,
        };
    }
    return {
        message: error?.message || 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
    };
};
exports.handleApiError = handleApiError;
//# sourceMappingURL=index.js.map