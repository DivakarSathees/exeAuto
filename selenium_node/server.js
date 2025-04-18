const express = require('express');
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
const cors = require("cors");
const app = express();
const os = require('os');
const { extractTestID } = require('./extractTestID');

const port = 3000;
const upload = multer({ dest: "uploads/" });

app.use(cors({ origin: ['https://forntend-weightagesplit-1.onrender.com','http://localhost:4200'] }));

app.use(express.json());

let driver; // Global browser session
// const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'selenium-user-data-'));

// const options = new chrome.Options();
// options.addArguments('--headless');
// options.addArguments('--no-sandbox');
// options.addArguments('--disable-dev-shm-usage');
// options.addArguments('--disable-gpu');
// options.addArguments('--window-size=1920,1080');

// POST endpoint to perform login
app.post('/visit', upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send({ error: "No file uploaded." });
  }
  let { LOGIN_URL, USEREMAIL, PASSWORD, COURSE, MODULE, TESTNAME } = req.body;

  if (!LOGIN_URL || !USEREMAIL || !PASSWORD) {
    return res.status(400).send({ error: 'LOGIN_URL, USEREMAIL, and PASSWORD are required.' });
  }

  const filePath = req.file.path;
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Process each row in the sheet
  const UEmails = sheetData.map((row) => {
    return {
      UEmail: row["User Email"],
    };
  });
  let testIds = [];
  let token = null; // Initialize token variable

  // fs.unlinkSync(filePath);
  try {
    // Make the POST request to the API
    // const apiResponse = await axios.post("http://localhost:3000/visit", formData, {
    // const apiResponse = await axios.post(process.env.BACKEND_TESTID_URL, formData, {
    //   headers: {
    //     headers: formData.getHeaders(), // Use formData.getHeaders() from the form-data package
    //   },
    // });
    // testIds = apiResponse.data; 
    const { testIds: ids, token: extractedToken } = await extractTestID(
      filePath,
      LOGIN_URL,
      USEREMAIL,
      PASSWORD,
      COURSE,
      MODULE,
      TESTNAME
    );

    testIds = ids;
    token = token || extractedToken;
    res.send({ testIds, token }); // Send the test IDs as a response
    
    } catch (error) {
    console.error("Error making POST request to /visit API:", error.message);
    res.status(500).send({ error: "Failed to fetch test IDs from the API." });
    return;
    } 


  // try {
  //   // Start browser once
  // //   if (!driver) {
  // //     // driver = await new Builder().forBrowser('chrome').build();
  // //     driver = await new Builder()
  // //       .forBrowser('chrome')
  // //       .setChromeOptions(options)
  // //       .build();

  // //   }

  // //   await driver.get(LOGIN_URL);

  // //   const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  // //   const untilDriver = driver.wait.bind(driver);
  // //   await wait(5000);


  // //   // Fill email
  // //   const emailField = await untilDriver(until.elementLocated(By.id("emailAddress")), 10000);
  // //   await emailField.sendKeys(USEREMAIL);
  // //   console.log("Email entered:", USEREMAIL);
    
  // //   const passwordField = await untilDriver(until.elementLocated(By.id("password")), 10000);
  // //   await passwordField.sendKeys(PASSWORD);
  // //   console.log("password entered");
    

  // //   // Click next
  // //   const nextButton = await driver.findElement(By.xpath("//*[@id=\"Sign\"]/div/form/div[4]/button"));
  // //   await nextButton.click();
  // //   console.log("Clicked next button");
  // //   await wait(10000);

  // //   // const courses = await driver.findElement(By.xpath("//*[@id=\"fullHeightForSidemenu\"]/ul/li[3]"));
  // //   const courses = await untilDriver(until.elementLocated(By.xpath("//*[@id=\"fullHeightForSidemenu\"]/ul/li[3]")), 10000);

  // //   await courses.click();
  // //   console.log("Clicked courses button");
  // //   await wait(10000);

  // //   const searchField = await untilDriver(until.elementLocated(By.xpath("/html/body/app-root/div/app-course-main/app-course/div/div[1]/div/div[3]/div[1]/input")), 10000);
    
  // //   await searchField.sendKeys(COURSE);
  // //   console.log("Course name entered:", COURSE);
  // //   // await wait(10000);

  // //   const searchButton = await untilDriver(until.elementLocated(By.xpath("/html/body/app-root/div/app-course-main/app-course/div/div[1]/div/div[3]/div[1]/button")), 10000);
  // //   await searchButton.click();
  // //   console.log("Clicked search button");
  // //   await wait(10000);

  // //   const courseElement = await untilDriver(until.elementLocated(By.xpath(`//*[contains(text(), '${COURSE}')]`)), 10000);
  // //   // const courseElement = await untilDriver(until.elementLocated(By.xpath(`//*[contains(text(), 'Testing_course_practice')]`)), 10000);
  // //   await courseElement.click();
  // //   console.log("Clicked course element");
  // //   await wait(10000);

  // //   // const moduleElement = await untilDriver(until.elementLocated(By.xpath(`//*[@id="ui-tabpanel-3"]/div/div/div[1]/div[3]/div[2]`)), 10000);
  // //   // await moduleElement.click();
  // //   // console.log("Clicked module element");
  // //   // await wait(10000);
  // //   const xpath = `//*[@id="ui-tabpanel-3"]/div/div/div[1]/div[3]/div[${MODULE}]`;

  // //   const moduleElement = await driver.wait(until.elementLocated(By.xpath(xpath)), 10000);

  // //   // Make sure it's visible, scroll into view, and enabled
  // //   await driver.wait(until.elementIsVisible(moduleElement), 10000);
  // //   await driver.executeScript("arguments[0].scrollIntoView(true);", moduleElement);
  // //   await driver.wait(until.elementIsEnabled(moduleElement), 10000);

  // //   // Now click
  // //   await moduleElement.click();
  // //   console.log("Clicked module element");
  // //   // await wait(10000);


  // //   // /html/body/app-root/div/app-course-main/app-course/p-dialog[7]/div/div[2]/p-tabview/div/div/p-tabpanel[4]/div/div/div/div[2]/div/div[2]/div[2]/div[1]/div[1]/span[2]

  // //   // const xpath1 = `/html/body/app-root/div/app-course-main/app-course/p-dialog[7]/div/div[2]/p-tabview/div/div/p-tabpanel[4]/div/div/div/div[2]/div/div[2]/div[2]/div[1]/div[6]/button[1]`;

  // //   try{
    

  // //   const xpath1 = `//div[contains(@class, 'moduletest')][.//div[contains(@class, 'ui-g-5') and contains(normalize-space(.), "${TESTNAME}")]]//button[normalize-space(text())='View Results']`;
  // //   // const xpath1 = `//div[contains(@class, 'moduletest')][.//span[contains(@class, 'testname') and normalize-space(text()) = '${moduleName}']]//button[normalize-space(text())='View Results']`;

  // //   const viewResultsButton = await driver.wait(
  // //     until.elementLocated(By.xpath(xpath1)),
  // //     10000
  // //   );

  // //   await driver.wait(until.elementIsVisible(viewResultsButton), 10000);
  // //   await driver.executeScript("arguments[0].scrollIntoView(true);", viewResultsButton);
  // //   await viewResultsButton.click();

  // //   // await wait(10000);
  // // }catch (error) {
  // //   // const xpath1 = `//div[contains(@class, 'moduletest')][.//div[contains(@class, 'ui-g-5') and contains(normalize-space(.), "${TESTNAME}")]]//button[normalize-space(text())='View Results']`;
  // //   const xpath1 = `//div[contains(@class, 'moduletest')][.//span[contains(@class, 'testname') and normalize-space(text()) = '${TESTNAME}']]//button[normalize-space(text())='View Results']`;

  // //   const viewResultsButton = await driver.wait(
  // //     until.elementLocated(By.xpath(xpath1)),
  // //     10000
  // //   );

  // //   await driver.wait(until.elementIsVisible(viewResultsButton), 10000);
  // //   await driver.executeScript("arguments[0].scrollIntoView(true);", viewResultsButton);
  // //   await viewResultsButton.click();

  // //   await wait(10000);
  // // }
  
  // //   let testIds = [];


  // //   for (const uEmail of UEmails) {

  // //   const searchUserNameField = await untilDriver(until.elementLocated(By.xpath("//*[@id=\"studentModal\"]/div/div[2]/app-test-results-table/div[1]/span/input")), 10000);
  // //   // clear the field before sending keys
  // //   await searchUserNameField.clear();
  // //   await searchUserNameField.sendKeys(uEmail.UEmail);

  // //   await wait(5000);

  // //   const searchUserNameButton = await driver.findElement(By.xpath("//*[@id=\"studentModal\"]/div/div[2]/app-test-results-table/div[1]/span/button"));
  // //   await searchUserNameButton.click();

  // //   await wait(5000);

  // //   const analysisButton = await untilDriver(until.elementLocated(By.xpath("//*[@id=\"testresulttable\"]/div/div[2]/div/div[2]/div/table/tbody/tr[2]/td[4]/span[2]/span/i")), 5000);
  // //   await analysisButton.click();

  // //   const originalWindow = await driver.getWindowHandle();
  // //   await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 10000);

  // //   // Step 3: Switch to the new tab
  // //   const windows = await driver.getAllWindowHandles();
  // //   const newWindow = windows.find(win => win !== originalWindow);
  // //   await driver.switchTo().window(newWindow);

  // //   // Step 4: Get the URL of the new tab
  // //   const testId = await driver.getCurrentUrl();
  // //   testIds.push({  testId,email: uEmail.UEmail, }); // Save with email if needed
  

  // //   // Step 5: Switch back to the original tab
  // //   await driver.close(); // Close the new tab
  // //   await driver.switchTo().window(originalWindow);
  // //   await driver.wait(async () => (await driver.getAllWindowHandles()).length === 1, 10000); // Wait until back to original tab
  // //   // await driver.navigate().refresh(); // Refresh the original tab to ensure it's in sync



  // //   // await wait(10000); // Allow any transitions or animations

  // //   }



  // //   console.log("✅ Login attempted.");
  // //   // await wait(10000); // Allow page to settle
  // //   // send the response as new tab URL
  // //   for (const test of testIds) {
  // //     console.log("Test ID URL:", test.testId);
  // //   }
  // //   await driver.quit();
  // //   driver = null; // Reset driver to null after quitting
  //   res.send( testIds );

  // } catch (error) {
  //   console.error("❌ Login failed:", error);
  //   res.status(500).send({ error: error.message });
  // }
});

app.get('/screenshot', (req, res) => {
  res.sendFile(__dirname + '/screenshot_course_search.png');
});


// Optional endpoint to close browser
app.get('/close', async (req, res) => {
  if (driver) {
    await driver.quit();
    driver = null;
    res.send({ message: "Browser closed." });
  } else {
    res.send({ message: "No browser session is active." });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
