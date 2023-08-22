# Simplify
Use Chatgpt to simplify training text for less capable readers.
- Since documents can be long, this app breaks them up into small chunks to process one at a time.
- The app presents some configurable parameters to tweek chatgpt
- There is a prompt window to instruct chatgpt what to do with your text. You can cut and paste between Previous prompts and current prompt.
- It has a window to dump your raw text into.
- Two windows are displayed side-by-side to show a chunk of your original text and chatgpt's simplification of it.
- Below the chunk windows is an assembly of all the chunks.
## Install
- Place all files in same folder on your local device.
- Double-click the html file to load it up into "Chrome" 
- This app requires an openAI API license (which is not free)
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
