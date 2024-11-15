export const createProductSlug = (name: string, id: string) => {
    return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`;
};

export const extractIdFromSlug = (slug: string) => {
    return slug.slice(-36);
};