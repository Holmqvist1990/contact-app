import { nanoid } from "https://esm.sh/nanoid@4.0.0/non-secure/index.js";

document.querySelectorAll("[data-menu]").forEach(menu => {
  const
  button = menu.querySelector("[data-menu-button]"),
  body = menu.querySelector("[data-menu-items]"),
  items = Array.from(body.querySelectorAll("[data-menu-item]"));

  const isOpen = () => menu.dataset.menu === "open";

  const bodyId = body.id ?? (body.id = nanoid());

  button.setAttribute("aria-haspopup", "menu");
  button.setAttribute("aria-controls", bodyId);

  body.setAttribute("role", "menu");

  items.forEach(item => {
    item.setAttribute("role", "menuitem");
    item.setAttribute("tabindex", "-1");
  });


  function toggleMenu(open = !isOpen()) {
    if (open) {
      menu.dataset.menu = "open"
      body.hidden = false
      button.setAttribute("aria-expanded", "true")
      items[0].focus()
    } else {
      menu.dataset.menu = "closed"
      body.hidden = true
      button.setAttribute("aria-expanded", "false")
    }
  }

  toggleMenu(isOpen())
  button.addEventListener("click", () => toggleMenu())

  window.addEventListener("click", function clickAway(event) {
    if (!menu.isConnected) window.removeEventListener("click", clickAway);
    if (menu.contains(event.target)) return;
    toggleMenu(false);
  })

  const currentIndex = () => {
    const idx = items.indexOf(document.activeElement);
    if (idx === -1) return 0;
    return idx;
  }

  menu.addEventListener("keydown", e => {
    if (e.key === "ArrowUp") {
      items[currentIndex() - 1]?.focus();

    } else if (e.key === "ArrowDown") {
      items[currentIndex() + 1]?.focus();

    } else if (e.key === "Space") {
      items[currentIndex()].click();

    } else if (e.key === "Home") {
      items[0].focus();

    } else if (e.key === "End") {
      items[items.length - 1].focus();

    } else if (e.key === "Escape") {
      toggleMenu(false);
      button.focus();
    }
  })
})
