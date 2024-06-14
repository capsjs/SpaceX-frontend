$(document).ready(function() {
  const url = `https://api.spacexdata.com/v4/launches`;


function fetchNextLaunch() {
  $.get(url + '/next', function(data) {
    $('#launch-date').text(new Date(data.date_utc).toLocaleString());
    $('#launch-name').text(data.name);
    countdown(new Date(data.date_utc));
  });
}

function countdown(date) {
  function updateCountDown() {
    const today = new Date().getTime();
    const time = date.getTime() - today;
    const seconds = Math.floor((time % (1000*60)) / 1000);
    $('#countdown').text(seconds);
  }
  setInterval(updateCountDown, 1000);
}

function fetchLaunches(launchFilter = 'all') {
  $.get(url, function(data) {
    let filteredData;
    if(launchFilter === 'success') {
      filteredData = data.filter(launch => launch.success);
    } else if (launchFilter === 'failure') {
      filteredData = data.filter(launch => launch.success === false);
    } else {
      filteredData = data;
    }
    displayLaunches(filteredData.slice(0, 10));
  });
}

function displayLaunches(launches) {
  const launchList = $('#launch-container');
  launchList.empty();
  launches.forEach(launch => {
    const launchDate = new Date(launch.date_utc).toLocaleDateString();
    const launchItem = `
     <div class="launch-data">
          <h3>${launch.name}</h3>
          <p>Date : ${launchDate}</p>
          <p>Détail : ${launch.details || 'None available'}</p>
          <img src="${launch.links.patch.small}" alt="${launch.name}" />
          <p><a href="${launch.links.article}" target="_blank">Lire l'article</a></p>
          <p><a href="#" class="video-link" data-video-url="${launch.links.webcast}">
            <svg xmlns="http://www.w3.org/2000/svg"
              class="video-icon"
              fill="none" viewBox="0 0 24 24"
              stroke-width="1.5" stroke="currentColor"
              class="size-6">
              <path stroke-linecap="round"
              stroke-linejoin="round"
              d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </a></p>
          <p>Lieu de lancement : ${launch.launchpad}</p>
        </div>
    `;
    launchList.append(launchItem);
  });

  $('.video-link').click(function(event) {
    event.preventDefault();
    const videoUrl = $(this).data('video-url');
    const videoEmbedUrl = videoUrl.replace('watch?v=', 'embed/');
    $('#popup-video-container').html(
      `<iframe width="100%"
         height="500" src="${videoEmbedUrl}" 
         frameborder="0" allowfullscreen>
      </iframe>`);
    $('#popup-overlay').fadeIn();
  });
}

// Close pop-up on button click
$('#popup-close').click(function() {
  $('#popup-overlay').fadeOut();
  $('#popup-video-container').html('');
});

fetchNextLaunch();
fetchLaunches();

});
