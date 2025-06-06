# Oppskrift for eksport av Skjemabygger til GitHub

GitExporter er et tool som kan kjøres via npx for å eksportere bare enkelte deler av et repo til et annet.
Vi bruker det her for Skjemabygger for å unngå å eksportere ut Helsenorge relatert konfig filer etc.
( ROX benytter også GitExporter for et av sine repoer tilsvarende )

## Clone GitHub-repository eller hent siste fra master

Legg til i samme rotmappe som HN-Skjemabygger og andre repositories. (For eksempel i C:\Users\xyz\source\repos)

```
git clone https://github.com/helsenorge/structor-mirror.git
```

eller

```
git pull origin master
git checkout master
```

## Kjør gitexporter

Stå i rotmappen for repositories (for eksempel i C:\Users\xyz\source\repos>) og kjør:

```
npx betterplace-gitexporter HN-Skjemabygger//gitexporter//gitexporter.config.json
```

(Hvis npx feiler må C++ SDK og Python muligens installeres)

Hvis ingen feil oppstod, kjør github-push.sh på MacOS eller Windows ( for windows bruk f.eks Git Bash )
