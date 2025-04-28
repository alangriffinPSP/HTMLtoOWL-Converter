# HTML to OWL Converter

This project sets out to convert HTML code into OWL language.

### Initial commit

A very basic working model that just replaces specific characters but does not account for their relative usage.

### 24/02/2025

First update. Some specific situations still aren't accurately captured.

//WORKING (I think!)
- Closing tags identified
- Opening tags identified
- Output pane working
- Tag content
- Tag attributes
- Nested tags
- Auto closing tags now detected


### 17/03/2025

New approach using DOM node detection instead. Lots not working. Initial commit of this method.

### 26/03/2025

Refactored with one main loop. Still not 100% complete. Closing parentheses handling still a work in progress.

### 07/04/2025

Code refactored once more by Rollo. I have added formatting to the output text and escaping of quotation marks as required by OWL. 

### 28/04/25

Tweaked output formatting, re-wrote indentation logic.