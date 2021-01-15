# D&D Beyond Campaign DM Screen

## Embedded DM Screen

![Screen Shot 2019-12-05 at 10 06 16 PM](https://user-images.githubusercontent.com/7372540/70300109-84052e80-17ab-11ea-97c1-c250e4ad8d29.png)

## Options popup

![Screen Shot 2019-12-06 at 3 18 43 PM](https://user-images.githubusercontent.com/7372540/70363361-e8bc9980-183c-11ea-8bd8-1b03cab609a7.png)

## New button in the campaign menu to open a popup for the screen

![Screen Shot 2019-12-08 at 2 39 22 PM](https://user-images.githubusercontent.com/7372540/70397940-4f6fbd80-19cb-11ea-998c-7b68606794a0.png)

## External DM screen

![Screen Shot 2019-12-08 at 2 58 47 PM](https://user-images.githubusercontent.com/7372540/70397941-4f6fbd80-19cb-11ea-9b1d-6e5f659b76ee.png)

This extension add more information on the D&D Beyond's campaign page to turn it into a DM screen.
This is a first version and I have a lot in mind on how to make it better, feel free to create an [issue](https://github.com/AshDevFr/ddb-campaign-screen/issues) if something is off.

## Todo:

- [ ] Better Readme

  - [ ] Add description
  - [ ] How to use

- [ ] Add tests

  - [ ] LIKE A LOT!!!!

- [x] Options

  - [x] Enable / Disable
  - [x] Refresh enable / disable
  - [x] Refresh time
  - [x] Keep previous options

- [ ] Pop out
  - [x] New UI to display the character info
  - [ ] Click to open the character in a new window
  - [ ] Reorder characters
  - [ ] Animations
    - [ ] Flash when character low life
    - [ ] Conditions
  - [ ] Dynamic screen
    - [ ] Add / Remove character by their id
  - [ ] Dynamic screen content

    - [ ] Add / Remove information
    - [ ] Reorganize information

## Known bugs

- [ ] Mage armor not working
- [ ] It doesn't seem to pick up feats at all.
- [X] If a character has Alert it doesn't add to their initiative on the campaign screen.
- [X] It also doesn't pick up expertise gained from the prodigy skill if the chosen skill is on with a passive score (Perception, Insight, Investigation)
- [X] It does not add the bonus from feats like observant that adds 5 to the passive scores
- [ ] It does not add the modifiers to AC made from spells and other effects

## Contribute

First install all the dependencies with `yarn` or `npm install`.

### Test using the cli
Build the utils: `./node_modules/.bin/webpack --progress`

Compile the stats for a character id: `node src/cli.js -c [id]`  

### Using the extension

Run the build `yarn build` or `npm run build`.

It will build the extension in `dist/`, use this directory and load it in chrome. (`Manage Extensions > Load unpacked`)


## Credits

This extension is inspired by this project [https://github.com/mivalsten/ddb-dm-screen](https://github.com/mivalsten/ddb-dm-screen) which unfortunately did not work for me.
I only reused some of their CSS style as I did not want to spend to much time on it yet.
