export function getAvatarInitials(userName: string | null): string {
    if (null === userName) {
        return '?'
    }

    if (userName.includes(' ') || userName.includes('_')) {
        const words = userName.split(/[\s_]+/); // Split by space or underscore
        return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }

    const matches = userName.match(/[A-Z][a-z]+/g);
    if (matches && matches.length >= 2) {
        return matches[0].charAt(0).toUpperCase() + matches[1].charAt(0).toUpperCase();
    }

    return userName.charAt(0).toUpperCase();
}
