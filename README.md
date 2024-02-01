# Simplify
Use Chatgpt to simplify training content for less capable readers.
- Since documents can be long, this app breaks them up into small chunks to process one at a time. A more expensive license
- The app presents some configurable parameters to tweek chatgpt
- There is a prompt window to instruct chatgpt what to do with your text. You can cut and paste between Previous prompts and current prompt.
- It has a window to dump your raw text into.
- Two windows are displayed side-by-side to show a chunk of your original text and chatgpt's simplification of it.
- Below the chunk windows is an assembly of all the chunks.
## Install
- Place all files in same folder on your local device.
  One way to do this is to
    - Navigate to github.com.unfoldingWord=box3/simplify
    - click on Code button and select download zip file this will place code in your downloads directory
    - After downloading click file folder after download to open folder in file explorer
    - Right click on simplify-main.zip file and click extract then take defaults
    - Double click on simplify.html
- This app requires an openAI API license (which is not free)
- To get an OpenAi key
  - Navigate to https://chat.openai.com/auth/login in your browser
  - Sign up to create an account
  - follow instructions to get a key
  - Copy this somewhere private to be able to access it later
## Usage
- There are a few possible strategies of use.
  - First make the max words slider as large as possible. If the simplification fails then make the chunks smaller. Larger chunks may not complete. Larger chunks will retain more context of your whole document.
  - You can take the completed simplification and dump it into the source text and do some other processing like language translation.
  - There are some buffers that you can copy and paste into for exeptional intermediate results. The app supports up to 6 buffers.
  - If you like a prompt you can add it to the "Previous Prompt" window for later use.
  - If the app cannot process your document in a single chunk then you can single step it and reveiw/approve chunks one at a time.
    - The play button will process the complete document.
    - The Next button will do one chunk then stop.
    - Pressing it again will move the current simplified chunk to the combined text window then process one more chunk
    - Pressing the play will run from the current chunk to the end.
    - The Eject button will stop processing the current document.
    - The Redo button will reprocess the same chunk.  
- There is a ? in the upper left hand corner which displays help text for more information.
## Details
- This app is client-side javascript with with no dependencies on other libraries.
- Only tested on Chrome.
- Chatgpt requires access to the internet to use its API.
