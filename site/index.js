fetch('./api/').then(async (response) => {
  console.log(Array.from(response.headers.entries()));
});
