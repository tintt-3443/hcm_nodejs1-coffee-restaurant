function getCookie(cname) {
  var name = cname + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
}

function buildURLWithQuery(currentURL, newQueryObject) {
  const parsedURL = new URL(currentURL);
  const searchParams = parsedURL.searchParams;

  if (newQueryObject.hasOwnProperty('status')) {
    const statusValues = Array.isArray(newQueryObject['status'])
      ? newQueryObject['status']
      : [newQueryObject['status']];
    const currentStatusParams = searchParams.getAll('status[]');
    for (const statusValue of statusValues) {
      if (currentStatusParams.includes(statusValue)) {
        searchParams.delete('status[]');
        for (const param of currentStatusParams) {
          if (param !== statusValue) {
            searchParams.append('status[]', param);
          }
        }
      } else {
        searchParams.append('status[]', statusValue);
      }
    }
    delete newQueryObject['status'];
  }

  for (const [key, value] of Object.entries(newQueryObject)) {
    searchParams.set(key, value);
  }

  const newURL = `${parsedURL.protocol}//${parsedURL.host}${
    parsedURL.pathname
  }?${searchParams.toString()}`;
  return newURL;
}

const getValueFromQueryString = (key) => {
  const urlParams = new URL(window.location.href).searchParams;
  if (urlParams.has(key)) {
    return urlParams.get(key);
  }
  return '';
};
