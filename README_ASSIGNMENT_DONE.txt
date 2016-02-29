------------------------- NEW VERSION NOTES --------------------------
The code has been shortened and the OOP approach has been abandoned, as requested.
Moreover the carousel is able to display dinamically the images in the directory (an upper bound of 50 images has been set).
If there is no image to display, a message is displayed. If we have only one image, thumbnails and navigation arrows are not displayed.


----------------------- GENERAL INFORMATIONS -------------------------

In the code provided, the tasks 1 and 6 (in my priority list, respectively: photo carousel and improve room table) have been implemented.
I've chosen these two tasks, althought they weren't both the most critical (always according to my priority list), because I found these the most challenging to develop and I think that the final code reflects pretty well my client-side coding skills.

To achive this result, you'll notice that I didn't use any prebuilt js library, nor any JQuery plugin. Everything has been made from scratch, in a pure object oriented JavaScript programming fashion. Furthermore, the usage of JQuery is minimum, it was only used for convenience in certain points: it would be extremely easy to build a pure JS version, without JQuery dependancies, from my code.
As another metric to judge my work, I can tell you that all the code has been written in three days (4th,5th,6th August 2015).
The page has also been tested in the main browsers, as written in the assignment.

I've decided to not go further the development of these two tasks (the minimum required) because I've already written ca. 300 lines of code, and I think it won't be easy to read them all. And, as I said, I think that this could is enought to describe my skills.

The code itself is heavily commented and should be easily readeable. For any further explanation, don't be afraid to write me on lurus92@gmail.com

Thanks very much for this assignment, it was a nice experience to test my skills. Please, if you have any critics on the code (or you find some errors, or simila), tell me anyway: it would be always a learning experience.

Thanks again,

Luigi Russo


---------------------- QUICK NOTES ON CAROUSEL ----------------------
The carousel is composed by a big photo frame and some small thumbnails in the bottom. An interval starts the slideshow when the page is loaded. The user can navigate through the images clicking on the next/previous buttons or directly selecting one thumbnail.
In both cases the slideshow is stopped and the desidered photo is displayed enlarged.
There is also a black strip containing the description of the current big photo.
For implementation details, please see the comments in the code

--------------------- QUICK NOTES ON ROOM TABLE ---------------------
The room table is now sortable by occupancy or price of the room.
Just click on one of those columns to sort the table by that column (one click ascending, two descending).
The user can also select a quantity of the rooms, and the total price is updated (in the bottom).
The user can also click on the name of the room to have more information about it: in this case, a section with this details is displayed after the table.
For implementation details, please see the comments in the code