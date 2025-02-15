const validate = (schema, req) => {
    const { error } = schema.body.validate(req.body);
    if (error) {
      throw new Error(error.details.map((err) => err.message).join(", "));
    }
  };
  
module.exports = { validate };
  