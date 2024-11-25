export const createUserSlug = (id: string, firstName: string)=> {
    // Remove special characters and convert to lowercase
    const sanitizedName = firstName.toLowerCase().replace(/[^a-z0-9]/g, '');
    return id + "-" + sanitizedName;
}

