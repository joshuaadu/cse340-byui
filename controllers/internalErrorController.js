const internalErrorController = {};

internalErrorController.buildInternalServerError = async function (
  req,
  res,
  next
) {
  // const nav = await utilities.getNav();
  next({
    status: 500,
    message: "Oh no! There was a crash. Maybe try a different route?",
  });
};

export default internalErrorController;
