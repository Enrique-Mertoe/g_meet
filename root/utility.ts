const generateMeetID = (): string => {
    const randomDigits = () => Math.floor(100 + Math.random() * 900).toString(); // 3-digit number
    return `${randomDigits()}-${randomDigits()}-${randomDigits()}`;
};

const generateKey = (len: number = 10): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < len; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

const generateUsername = (): string => {
    const adjectives = ["Swift", "Brave", "Mighty", "Clever", "Bold", "Quick", "Lively", "Eager", "Cool", "Witty"];
    const nouns = ["Panda", "Tiger", "Eagle", "Wolf", "Falcon", "Bear", "Hawk", "Fox", "Shark", "Lion"];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}${randomNumber}`;
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
    });
};

export {
    generateMeetID,
    generateUsername,
    fileToBase64,
    generateKey
}
