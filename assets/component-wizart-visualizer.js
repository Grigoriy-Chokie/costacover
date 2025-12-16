
document.addEventListener("DOMContentLoaded", function () {
  const visuallyButton = document.querySelector(".wizart-visually-button");

  if (!visuallyButton) return;

  const observer = new MutationObserver((mutationsList, observer) => {
      const wizartButton = document.querySelector(".w-entry-point");

      if (wizartButton) {
          visuallyButton.classList.remove("visually-hidden");
          showWizartWindow(wizartButton)
          observer.disconnect();
      }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  function showWizartWindow(wizartButton) {
    visuallyButton.addEventListener('click', () => {
      wizartButton.click()
    })
  } 
});