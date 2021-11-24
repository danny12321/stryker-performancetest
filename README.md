Het script performancetest is een node.js script om de performance testen van StrykerJS.

# Instalatie
- Vul de settings.js
    - project = pad naar project waar stryker op gedraait moet worden.
    - paths = string array met daarin de paden naar de testen van het project.
    - command = command dat stryker laat draaien ```'npx stryker run'```
    - outputFile = naar van outputfile
    - summaryFile = naar van summaryfile
    - iterations = aantal keer dat test gedraaid wordt.s
    - timeBetweenInS = tijd tussen testen in seconden.
    - runName = naam van de run.
- Build het project ```tsc```
- Draai het script ```npm start```
