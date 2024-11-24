const schemas = {
  Category: {
    type: "object",
    properties: {
      category_name: {
        type: "string",
        description: "The name of the category.",
      },
      priority_type: {
        type: "string",
        description: "The priority of the category.",
        enum: ["need", "want", "saving"],
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the category was created.",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the category was last updated.",
      },
    },
    required: ["category_name", "priority_type"],
  },
  Goal: {
    type: "object",
    properties: {
      user_id: {
        type: "string",
        description: "The ID of the user associated with the goal.",
        format: "uuid",
      },
      name: {
        type: "string",
        description: "The name or description of the goal.",
      },
      required_amount: {
        type: "number",
        description: "The total required amount to achieve the goal.",
      },
      accumulated_amount: {
        type: "number",
        description: "The accumulated amount towards the goal.",
      },
      goal_percentage: {
        type: "number",
        description: "The percentage of the goal achieved.",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the goal was created.",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the goal was last updated.",
      },
    },
    required: ["user_id", "name", "required_amount", "accumulated_amount"],
  },
  User: {
    type: "object",
    properties: {
      first_name: {
        type: "string",
        description: "The user's first name.",
      },
      second_name: {
        type: "string",
        description: "The user's second name.",
      },
      email: {
        type: "string",
        description: "The user's email address.",
        format: "email",
      },
      password: {
        type: "string",
        description: "The user's password (hashed).",
      },
      total_balance: {
        type: "number",
        description: "The user's total balance (optional).",
      },
      otp: {
        type: "string",
        description: "The one-time password for the user (optional).",
      },
      otp_expires_at: {
        type: "string",
        format: "date-time",
        description: "The expiration date and time of the OTP (optional).",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the user was created.",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the user was last updated.",
      },
    },
    required: ["first_name", "second_name", "email", "password"],
  },
  Budget: {
    type: "object",
    properties: {
      budget_name: {
        type: "string",
        description: "The name of the budget.",
      },
      user_id: {
        type: "string",
        description: "The ID of the user associated with the budget.",
        format: "uuid",
      },
      total_income: {
        type: "number",
        description: "The total income allocated for the budget.",
      },
      needs_budget: {
        type: "number",
        description: "The portion of the budget allocated for needs.",
      },
      wants_budget: {
        type: "number",
        description: "The portion of the budget allocated for wants.",
      },
      savings_budget: {
        type: "number",
        description: "The portion of the budget allocated for savings.",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the budget was created.",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the budget was last updated.",
      },
    },
    required: ["budget_name", "user_id", "total_income"],
  },
  Transaction: {
    type: "object",
    properties: {
      user_id: {
        type: "string",
        description: "The ID of the user associated with the transaction.",
        format: "uuid",
      },
      name: {
        type: "string",
        description: "The name of the transaction.",
      },
      amount: {
        type: "string",
        description: "The amount involved in the transaction.",
      },
      type: {
        type: "string",
        description: "The type of transaction.",
        enum: ["expense", "income"],
      },
      category: {
        type: "string",
        description: "The ID of the category associated with the transaction.",
        format: "uuid",
      },
      percentage: {
        type: "number",
        description:
          "The percentage associated with the transaction (optional).",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the transaction was created.",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Timestamp when the transaction was last updated.",
      },
    },
    required: ["user_id", "name", "amount", "type", "category"],
  },
};

export default schemas;
