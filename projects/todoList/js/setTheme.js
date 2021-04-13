const favTheme = localStorage.getItem("prevSetTheme");
if (favTheme && favTheme !== "") themeStyleSheet.href = `./css/${favTheme}Theme.css`;
else themeStyleSheet.href = `./css/darkTheme.css`
