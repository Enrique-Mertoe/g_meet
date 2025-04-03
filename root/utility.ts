const generateMeetID = (): string => {
    const randomDigits = () => Math.floor(100 + Math.random() * 900).toString(); // 3-digit number
    return `${randomDigits()}-${randomDigits()}-${randomDigits()}`;
};

const generateUsername = (): string => {
    const adjectives = ["Swift", "Brave", "Mighty", "Clever", "Bold", "Quick", "Lively", "Eager", "Cool", "Witty"];
    const nouns = ["Panda", "Tiger", "Eagle", "Wolf", "Falcon", "Bear", "Hawk", "Fox", "Shark", "Lion"];
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit number

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    return `${randomAdjective}${randomNoun}${randomNumber}`;
};
export {
    generateMeetID,
    generateUsername
}
