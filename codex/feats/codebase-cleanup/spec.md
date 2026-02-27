i want to start a new feature for this repo: switching to react since i want to use the liquid glass apple ui elements which someone recretaed using react components.

this requires a few things. first, taking a look at how things are being done in this repo. is there unneeded bloat and complexity? if so, please simiplify. to add this complex feature we need to make sure the base is something we are fine with. i believe there might be a lot of bloat and over-engineered code in this codebase. it also may not be maintainable. is it organized well? i feel that all the files that the user can edit for content or to make new content should be in its own folder so there's no mix of code files and yaml type files. i'd also prefer to tuck away a lot of the code in directories so the root doesn't have a bunch of code files. just have this in mind when creatig the new file organization.

come up with a plan and review it with me for how you're goign to change the repo to make it a lot cleaner.

i noticed that on page load certain things load in at different times instead of all at once (like the navbar file text and stuff.) i also noticed that sometimes text loads then changes to what it should be like in the footer. i also noticed mutliple index.html's for each page. i think this contributes/is part of the bloat and lack of performance in the site. can this be done a bit better?
