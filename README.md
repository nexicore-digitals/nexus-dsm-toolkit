# Nexus DSM: Dataset Management for API Readiness

## Overview

**Nexus DSM** (Dataset Management) is a powerful, client-side web application designed to streamline the process of transforming and cleaning datasets (CSV and JSON) into a structured, API-ready JSON format. Built with vanilla JavaScript and styled using Tailwind CSS, Nexus DSM provides an intuitive interface for managing your data with precision and ease.

Whether you're a developer preparing data for a new API endpoint, a data analyst cleaning up a dataset, or anyone needing to manipulate data for programmatic use, Nexus DSM offers the tools you need to get the job done efficiently.

## Features

* **Dual Input Support:** Seamlessly upload datasets in both **CSV** and **JSON** formats.

* **Interactive Data Preview:**

  * View your **Original Data** (as parsed from the uploaded file) in a clean, readable form.

  * See the **Transformed Data** live after applying all your manipulation options.

  * Toggle between original and transformed views for easy comparison and verification.

* **Column Selection:** Choose precisely which columns from your dataset you want to include in the final JSON output.

* **Column Renaming:** Easily rename columns to ensure they conform to your desired API naming conventions (e.g., `snake_case` to `camelCase`).

* **Row Filtering:** Apply basic filters to include only the rows that meet specific criteria, allowing you to focus on relevant data.

* **Automated Data Cleaning:**

  * Converts all output keys to `camelCase` for API consistency.

  * Trims leading/trailing whitespace from string values.

  * Attempts to coerce string representations of numbers and booleans into their native types.

  * Removes fields with `null`, `undefined`, or empty string values, ensuring a clean output.

* **JSON Output & Download:** View the final, cleaned, and transformed JSON in a pretty-printed format and download it as a `.json` file.

* **Clear All Functionality:** Quickly reset the application to start fresh with a new dataset.

* **Modern & Responsive UI:** A clean, light, and tech-inspired user interface built with Tailwind CSS, ensuring a great experience on both desktop and mobile devices.

## How to Use

1. **Clone the Repository:**

    ``` bash
    git clone [https://github.com/owen-6936/nexus-dsm.git]
    cd nexus-dsm
    ```

2. **Open in Browser:**
    Open the `index.html` file directly in your web browser. No server is required as it's a client-side application.
    (Alternatively, you can use a live server extension in your code editor for convenience during development).

3. **Upload Your Data:**

    * Select either "CSV Input" or "JSON Input" using the radio buttons.

    * Click the "Upload File" button and select your `.csv` or `.json` dataset.

    * Once uploaded, the "Data Transformation Options" and "Data Preview" sections will appear.

4. **Configure Transformations:**

    * **Select Columns:** Use the checkboxes to choose which columns you want to keep.

    * **Rename Columns:** Enter new names for your columns in the provided input fields.

    * **Filter Rows:** Select a column from the dropdown and enter a value to filter rows.

5. **Process Data:**

    * Click the "Process Data" button to apply your selected transformations.

    * The "Transformed Data" tab in the preview section will automatically show the result, and the "Final JSON Output" text area will be populated.

6. **Download JSON:**

    * Click the "Download JSON" button to save your cleaned and transformed data as a `.json` file.

***and more...***

## Project Structure

## Technologies Used

* **HTML5:** For the application structure.

* **CSS3 :** For modern, utility-first styling and responsiveness.

* **JavaScript (Vanilla JS):** For all core logic, data parsing, transformations, and UI interactions.

## Future Enhancements (Ideas)

* **More Advanced Filtering:** Support for multiple filter conditions (AND/OR), regular expressions, numerical comparisons (greater than, less than).

* **Data Validation:** Add options to define data types for columns and validate input against them.

* **Data Aggregation:** Features to group data and perform aggregate functions (sum, average, count).

* **Data Joining/Merging:** Ability to combine data from multiple uploaded files.

* **Export to Other Formats:** Support for exporting to CSV or Excel.

* **Interactive Table Editing:** Allow direct editing of cell values within the preview table.

* **Saving/Loading Presets:** Save transformation configurations for reuse.

## Contribution

Feel free to fork this repository, open issues, or submit pull requests if you have ideas for improvements or new features!

Developed with ❤️ by Owen.
