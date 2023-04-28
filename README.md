# Mighty Mite Motors 

## Fork the Repository

1. Click the "Fork" button in the upper-right corner of the page.<br>
![image](https://user-images.githubusercontent.com/82688509/235267135-9d5546f7-7da6-4668-bbbd-456ee5839089.png)
2. Select your GitHub account as the destination for the fork.
3. Click `Create fork` and wait for the forking process to complete. You will now have a copy of the repository under your GitHub account.

## Clone the Repository

1. Open terminal.
2. Navigate to the directory where you want to clone the repository. Pwede sa inyong Desktop mo mag clone.
3. Run the following command, replacing `<your-username>` with your GitHub username (Remove the `<` and `>`):
   
   ```
   git clone https://github.com/<your-username>/Mighty-Mite-Motors.git
   ```
   
4. Change to the newly created directory by running:

   ```
   cd Mighty-Mite-Motors
   ```

## Modify the Code

1. Open the project in your code editor.
2. Browse through the project files and locate the file(s) you want to modify.
3. Make your desired changes to the code.
4. Save your changes.

## Commit and Push Changes

1. In your terminal, navigate to the project directory if you are not already there.
2. Run `git status` to check the modified files.
3. Stage the changes by running:

   ```
   git add <modified-file-1> <modified-file-2> ...
   ```

4. Commit the changes with a descriptive message:

   ```
   git commit -m "A brief description of the changes made"
   ```

5. Push the changes to your forked repository:

   ```
   git push origin main
   ```

## Create a Pull Request

1. Visit `https://github.com/jahriko/Mighty-Mite-Motors/pulls` 
2. Click the "New Pull Request" button.
3. Ensure the "base repository" is set to `jahriko/Mighty-Mite-Motors` and the "head repository" is set to your forked repository.
4. Review your changes and click "Create Pull Request."
5. Add a descriptive title and detailed description of the changes made.
6. Submit the pull request.
