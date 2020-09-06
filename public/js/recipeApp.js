$(document).ready(() => {
  $("#modal-button").click(() => {
    $(".modal-body").html("");
    $.get("/api/courses", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) {
        return;
      } else {
        data.courses.forEach(course => {
          $(".modal-body").append(
            `<div>
              <span class="course-title">${course.title}</span>
              <div class="course-description">${course.description}</div>
              <button class="join-button" data-id="${course._id}">Join</button>
            </div>`
          );
        });
      }
    }).then(() => {
      // After finishing Ajax request, call addJoinButtonListener to add event listener for each button
      addJoinButtonListener();
    });
  });
});

let addJoinButtonListener = () => {
  $(".join-button").click(event => {
    // confirm target button
    let $button = $(event.target),
      // get course id data
      courseId = $button.data("id");
    // Ajax request with course id you want to join
    $.get(`/api/courses/${courseId}/join`, (results = {}) => {
      let data = results.data;
      // after confirming the request, update course data you joined
      if (data && data.success) {
        $button
          .text("Joined!")
          .addClass("joined-button")
          .removeClass("join-button");
      } else {
        $button.text("Failed to join the course! Try again!");
      }
    });
  });
}