// const puppeteer = require('puppeteer');
// // require('dotenv').config();

// puplocalstorage = async (email, password) => {
//     try {
//         const data = await loginAndGetLocalStorage(
//             "https://admin.ltimindtree.iamneo.ai/login", // Replace with the actual login URL
//             // process.env.LTI_USER_NAME,                 
//             // process.env.LTI_PASSWORD     
//             email, password              
//         );
//         return data; // Return the data here
//     } catch (error) {
//         console.error('Error:', error);
//         throw error; // Rethrow the error to handle it outside
//     }

//         async function loginAndGetLocalStorage(url, USEREMAIL, PASSWORD) {
//             //   // Launch a headless browser
//             const browser = await puppeteer.launch({ 
//                 headless: false,
//                 cacheDir: '/opt/render/.cache/puppeteer',
                
//                 args: [
//                     '--no-sandbox',
//                       '--disable-setuid-sandbox',
//                       '--disable-dev-shm-usage',
//                       '--remote-debugging-port=9222',
//                       '--start-maximized',
//                       '--ignore-certificate-errors'
//                   ],
//              }); // Set to false for debugging
//             const page = await browser.newPage();
//             await page.setViewport({
//             width: 1480, // Full width for most screens
//             height: 800, // Full height
//             });
//             try {
//                 await page.goto(url, { waitUntil: "networkidle2" });
//                 await page.type("#emailAddress", USEREMAIL);
//                 await page.type("#password", PASSWORD);
//                 await page.click(".form__button.ladda-button");
//                 await page.waitForNavigation({ waitUntil: "networkidle2" });
            
//                 await page.waitForSelector("li[ptooltip='Courses']", { visible: true });

//                 try {
//                     await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 10 seconds
//                 await page.click("li[ptooltip='Courses']");
//                 await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for 10 seconds

//                 await page.waitForSelector("input[placeholder='Enter course name to search']", { visible: true });

//                 // Type 'abcd' into the search input
//                 await page.type("input[placeholder='Enter course name to search']", "LTIM Orchard Dotnet Dec 24 Batch 01 Assessment Course");
//                 await new Promise(resolve => setTimeout(resolve, 10000)); 

//                 // Wait for and click the search button
//                 await page.waitForSelector("button.search-icon", { visible: true });

//                 await page.click("button.search-icon");
//                 await new Promise(resolve => setTimeout(resolve, 4000)); 
//                 const courseText = 'LTIM Orchard Dotnet Dec 24 Batch 01 Assessment Course';

//                 const clicked = await page.evaluate((text) => {
//                 const xpath = `//*[contains(text(), "${text}")]`;
//                 const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//                 const node = result.singleNodeValue;
//                 if (node) {
//                     node.click();
//                     return true;
//                 }
//                 return false;
//                 }, courseText);

//                 if (!clicked) {
//                 console.log("❌ Course not found or click failed.");
//                 } else {
//                 console.log("✅ Course clicked successfully.");
//                 }
//                 await new Promise(resolve => setTimeout(resolve, 5000)); 


//                 const moduleText = 'Milestone 01';

//                 const clicked1 = await page.evaluate((text) => {
//                 const xpath = `//*[contains(text(), "${text}")]`;
//                 const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
//                 const node = result.singleNodeValue;
//                 if (node) {
//                     node.click();
//                     return true;
//                 }
//                 return false;
//                 }, moduleText);

//                 if (!clicked1) {
//                 console.log("❌ Module not found or click failed.");
//                 } else {
//                 console.log("✅ Module clicked successfully.");
//                 }



//                 console.log("Clicked normally");
//                 } catch (e) {
//                 console.log("Normal click failed, trying evaluate...", e);
//                 await page.evaluate(() => {
//                     const elem = document.querySelector("li[ptooltip='Courses']");
//                     if (elem) elem.click();
//                 });
//                 }

//                 await page.waitForNavigation({ waitUntil: "networkidle2" });




//                 // wait for 5 sec
//             // Extract local storage data
//             const localStorageData = await page.evaluate(() => {
//                 const data = {};
//                 for (let i = 0; i < localStorage.length; i++) {
//                 const key = localStorage.key(i);
//                 data[key] = localStorage.getItem(key);
//                 }
//                 return data;
//             });
        
//             // console.log('Local Storage Data:', localStorageData.token);
//             const tokenRegex = /"token":"(.*?)"/;
        
//             // Extract the token
//             const match = localStorageData.token.match(tokenRegex);
//             let token;
//             // Check and log the token
//             if (match && match[1]) {
//                 token = match[1];
//                 // console.log("Extracted Token:", token);
//             } else {
//                 console.log("Token not found.");
//             }
        
//             // Return the extracted data
//             return token;
//             } catch (error) {
//             console.error('Error during login or local storage extraction:', error);
//             throw error;
//             } finally {
//             // Close the browser
//             await browser.close();
//             }
//         }

// }

// puplocalstorage("divakar.s@iamneo.ai","divakar.s@308")

const puppeteer = require('puppeteer');
const xlsx = require("xlsx");
const fs = require("fs");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const puplocalstorage = async (email, password, course, module, testname) => {
    try {
        console.log("Launching automation...");

        const filePath = "D:/Project_Node_Selenium/tesingUserEmail.xlsx";
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const UEmails = sheetData.map(row => ({
            UEmail: row["User Email"]
        }));

        fs.unlinkSync(filePath); // remove file after reading
        console.log("Extracted User Emails:", UEmails);

        const data = await loginAndGetLocalStorage(
            "https://admin.ltimindtree.iamneo.ai/login",
            email, password, course, module, testname, UEmails
        );

        return data;
    } catch (error) {
        console.error('Error in puplocalstorage:', error);
        throw error;
    }
};

async function loginAndGetLocalStorage(url, USEREMAIL, PASSWORD, COURSE, MODULE, TESTNAME, UEmails) {
    const browser = await puppeteer.launch({
        // headless: true,
        headless: false,
        cacheDir: '/opt/render/.cache/puppeteer',
        args: [
                '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--remote-debugging-port=9222',
                    '--start-maximized',
                    '--ignore-certificate-errors'
                ],
        });

    const page = await browser.newPage();
    await page.setViewport({ width: 1480, height: 800 });

    try {
        await page.goto(url, { waitUntil: "networkidle2" });
        await page.type("#emailAddress", USEREMAIL);
        await page.type("#password", PASSWORD);
        await page.click(".form__button.ladda-button");
        await page.waitForNavigation({ waitUntil: "networkidle2" });
        await delay(2000);

        await page.waitForSelector("li[ptooltip='Courses']", { visible: true });
        await page.click("li[ptooltip='Courses']");
        await delay(4000);

        await page.waitForSelector("input[placeholder='Enter course name to search']", { visible: true });
        await page.type("input[placeholder='Enter course name to search']", COURSE);
        await delay(10000);

        await page.click("button.search-icon");
        await delay(4000);

        const courseClicked = await page.evaluate((text) => {
            const xpath = `//*[contains(text(), "${text}")]`;
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = result.singleNodeValue;
            if (node) {
                node.click();
                return true;
            }
            return false;
        }, COURSE);

        if (!courseClicked) console.log("❌ Course not found or click failed.");
        else console.log("✅ Course clicked.");

        await delay(5000);

        const moduleClicked = await page.evaluate((moduleIndex) => {
            const xpath = `//*[@id="ui-tabpanel-3"]/div/div/div[1]/div[3]/div[${moduleIndex}]`;
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = result.singleNodeValue;
            if (node) {
                node.click();
                return true;
            }
            return false;
        }, MODULE);

        if (!moduleClicked) console.log("❌ Module not found or click failed.");
        else console.log("✅ Module clicked.");

        await delay(4000);
        await page.screenshot({ path: 'screenshot_module.png', fullPage: true });

        const testClicked = await page.evaluate((testName) => {
            const xpath = `//div[contains(@class, 'moduletest')][.//span[contains(@class, 'testname') and normalize-space(text()) = '${testName}']]//button[normalize-space(text())='View Results']`;
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = result.singleNodeValue;
            if (node) {
                node.click();
                return true;
            }
            return false;
        }, TESTNAME);

        if (!testClicked) console.log("❌ Test Result button not found.");
        else console.log("✅ Test Result clicked.");

        await delay(4000);
        await page.screenshot({ path: 'screenshot_test.png', fullPage: true });

        const testIds = [];

        for (const { UEmail } of UEmails) {
            console.log("Processing email:", UEmail);

            await page.waitForSelector('input[placeholder="Enter your search term"]', { visible: true });
            await page.click('input[placeholder="Enter your search term"]', { clickCount: 3 });
            await page.keyboard.press('Backspace');
            await page.type('input[placeholder="Enter your search term"]', UEmail, { delay: 100 });

            await page.click('button.ui-inputgroup-addon-ec');
            await delay(3000);

            await page.waitForSelector('#testresulttable tr:nth-child(2) td:nth-child(4) span:nth-child(2) i', { visible: true });
            await page.click('#testresulttable tr:nth-child(2) td:nth-child(4) span:nth-child(2) i');

            await delay(3000);
            const pages = await browser.pages();
            const newTab = pages[pages.length - 1];

            if (newTab !== page) {
                await newTab.bringToFront();
                const testIdUrl = newTab.url();
                testIds.push({ testId: testIdUrl, email: UEmail });
                await newTab.close();
                await page.bringToFront();
            }
        }

        console.log("Extracted Test IDs:", testIds);

        const localStorageData = await page.evaluate(() => {
            const data = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                data[key] = localStorage.getItem(key);
            }
            return data;
        });

        const tokenMatch = localStorageData.token?.match(/"token":"(.*?)"/);
        const token = tokenMatch ? tokenMatch[1] : null;

        if (token) {
            console.log("✅ Extracted Token:", token);
        } else {
            console.log("❌ Token not found.");
        }

        return token;
    } catch (error) {
        console.error('Error during Puppeteer workflow:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

// Call the function with your login and test details
puplocalstorage(
    "divakar.s@iamneo.ai",
    "divakar.s@308",
    "LTIM Orchard Dotnet Dec 24 Batch 01 Assessment Course",
    "3",
    "LTIM Orchard Dotnet Dec 24 Milestone 01 Attempt 02 COD 02"
)
    .then(data => {
        console.log("Final Extracted Token:", data);
    })
    .catch(error => {
        console.error('Script failed:', error);
    });
