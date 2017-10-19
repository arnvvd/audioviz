class ColorManager {

  constructor(){
    this.currentColor = {};

    // AssociatedColor
    this.colors = [
      {
        isActive: false,
        color: [ ['24', '22', '85'], ['253', '141', '234'] ]// Blue + Pink
      },
      {
        isActive: false,
        color: [ ['199', '15', '95'], ['255', '239', '239'] ] // Strawberry +  LighterPink
      },
      {
        isActive: false,
        color: [ ['34', '34', '34'], ['255', '255', '255'] ] // black + white
      },
      {
        isActive: false,
        color: [ ['62', '24', '127'], ['6', '253', '226'] ] // purple + green
      }
    ];

    // Set Init Color
    this.changeCurrentColor();
  }


  changeCurrentColor() {
    let nextColors = this.colors.filter((color) => {
      return color.isActive != true;
    });

    let currentColor = nextColors[Math.floor(Math.random() * nextColors.length)];

    // Remove isActive
    this.colors.forEach((color) => {
      color.isActive = false;
    });

    currentColor.isActive = true;

    this.currentColor = currentColor;
  }
}

export let colorManager = new ColorManager();
