function get_all_contacts() {
  let contacts = [];

  let interval = setInterval(() => {
    let this_page_contacts = Array.from(
      document.querySelectorAll(".entity-result__title-text"),
    ).map((_) => ({
      name: _.firstElementChild.firstElementChild.firstChild.textContent,
      profile_link: "",
    }));

    contacts.push(...this_page_contacts);

    let next_button = document.querySelector("button.next"); // Assuming next button selector is 'button.next'
    if (next_button) {
      next_button.click();
    } else {
      clearInterval(interval);
      console.log(contacts);
      setTimeout(() => {
        console.log("Downloading data:", contacts);
        downloadBlob(
          JSON.stringify(contacts),
          "{company_name}.txt",
          "text/plain",
        );
      }, 100 * 5000); // Adjust the time interval as needed
    }
  }, 5000); // Adjust the time interval as needed
}

get_all_contacts();
