const bodyTag = document.getElementById("howMuch")

document.addEventListener(
  "DOMContentLoaded",
  event => {
    console.log("IronGenerator JS imported successfully!");

    setInterval(
      () => {
        checkValueUpdates();
      },
      bodyTag === "ValueBoardDetails" ? 2000 : 0
    );
  },

  false
);

const checkValueUpdates = () => {
  // If reply is typed no update happens
  const replyTyped = [...document.getElementsByName("reply")].every(
    reply => reply.value === ""
  );

const value = document.getElementById('howMuch')
console.log(value)