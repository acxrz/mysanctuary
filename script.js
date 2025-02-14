window.onload = function () {
  const loadingScreen = document.getElementById("loadingScreen");
  const passwordContainer = document.getElementById("passwordContainer");

  setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
          loadingScreen.style.display = "none";
          passwordContainer.classList.remove("hidden");
      }, 500);
  }, 3000);
};

function checkPassword() {
  const password = document.getElementById("passwordInput").value;
  const message = document.getElementById("message");

  if (password === "061224") {
      window.location.href = "panel/panel.html";
  } else {
      message.style.color = "red";
      message.textContent = "X";
  }

  document.getElementById("passwordInput").value = "";
}
