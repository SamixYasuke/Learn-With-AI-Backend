const dummySqueezes = [
  {
    id: "1",
    email: "john.doe@example.com",
    first_name: "John",
    last_name: "Doe",
    phone: "123-456-7890",
    location: "New York",
    job_title: "Software Engineer",
    company: "Tech Corp",
    interests: "Technology, Programming",
    referral_source: "Online",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    first_name: "Jane",
    last_name: "Smith",
    phone: "098-765-4321",
    location: "San Francisco",
    job_title: "Product Manager",
    company: "Innovative Solutions",
    interests: "Product Design, UX",
    referral_source: "Word of Mouth",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getAllSqueezes = async (page: number = 1, limit: number = 10) => {
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    return dummySqueezes.slice(startIndex, endIndex);
  } catch (error) {
    throw new Error("Error fetching squeezes: " + error.message);
  }
};

export const createSqueeze = async (data: any) => {
  try {
    const newSqueeze = {
      ...data,
      id: (dummySqueezes.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dummySqueezes.push(newSqueeze);
    return newSqueeze;
  } catch (error) {
    throw new Error("Error creating squeeze: " + error.message);
  }
};

export const getSqueezeById = async (id: string) => {
  try {
    const squeeze = dummySqueezes.find((squeeze) => squeeze.id === id);
    if (!squeeze) {
      throw new Error("Squeeze not found");
    }
    return squeeze;
  } catch (error) {
    throw new Error("Error fetching squeeze: " + error.message);
  }
};
