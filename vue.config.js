module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "com.stave.ramanspectrometer",
        productName: "Raman Spectrometer",
        win: {
          icon: "dist_electron/icons/icon.ico"
        }
      }
    }
  }
}