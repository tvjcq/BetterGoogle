# BetterGoogle Chrome Extension

Enhance your Google search experience with additional features and a cleaner interface.

## Features

- **Ad-Free Searches**: Automatically removes sponsored results
- **Quick Navigation Tabs**: Adds tabs for Maps, Translation, Wikipedia, and Trends
- **Smart Search Tools**:
  - Direct "I'm Feeling Lucky" button
  - ChatGPT integration (sends your query directly to ChatGPT)
  - Advanced filter options (site:, filetype:, inurl:, etc.)

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top-right corner)
4. Click "Load unpacked"
5. Select the BetterGoogle folder

## Usage

- **ChatGPT Integration**: Set your default ChatGPT prompt in the extension options
- **Filter Button**: Click to access advanced Google search operators with a user-friendly interface
- **Navigation Tabs**: Additional tabs appear next to the standard Google tabs (All, Images, etc.)

## Configuration

Right-click the extension icon and select "Options" to:

- Configure your default ChatGPT prompt
- Customize other settings

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Notes

- The extension uses content scripts to modify Google search pages
- Icons are provided as SVG files and injected into the page
- Storage API is used for saving user preferences

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various Google search enhancing extensions
- ChatGPT integration for smarter search
