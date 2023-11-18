# editor.com 

The skeleton of a content distribution Infrastructure for AevyTV (Containerized with Docker)


<img width="1355" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/7f83dc44-a33f-49e0-8994-521070a06a88">

System Design of the Video Uploader (Transcoder):

<img width="1355" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/2fbe98e6-0f09-4f59-a5ab-6d45333c9cdc">
<img width="1355" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/409f78bb-3fd3-4711-a6c0-3b0eddd1f227">
<img width="1355" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/9994c2a8-3f57-4ddf-b0b7-10d573d0bda5">


AevyTV runs a Video Editing Cohort. They get editors from across the country in India, make them into top 1% editors, and give them access to a network of some of the best content creators across India and Abroad, like Ali Abdaal, Tanmay Bhat, Raj Shamani, and more.


## The problem

Currently, their system of providing opportunities to editors requires a lot of manual work. Google forms are submitted by students, and creators based on certain criteria, and those google forms are then manually looked through by Aevy to figure out who would be the best fit. This approach involves a lot of manual labour from the company's side, and more work from the creator's side too to fill out a google form, and the same from the editor's side. And also, all videos of editors go on unlisted youtube videos, and those links are what creators recieve. 
And also, even if there was a one stop platform for editors to upload their content on which can be seen by editors, those videos would be of low resolution if not transcoded, and streamed using Adaptive Bitrate Streaming.


## The solution

I built the moat of the platform where editors, and creators can sign up, and within a few clicks and details:

Creators:

- Creators would be on a page where they would have access to certain filters like Location, Opportunity Duration, and more, and editors while signing up would have chosen their preferences.
- They would see a bunch of videos, all of those videos having been transcoded, and being played using the HLS protocol.
- Creators can look at those videos, judge an editor, and quickly within one click reach out through social media links added in the profile by the editor.


Editors:

- Editors would get to select their work preferences, and can upload any video that they believe is an accurate representation of their work. These videos can be liked.


<img width="1224" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/22ef83be-ed08-4aa9-819c-2c1a24cd6b26">
<img width="1224" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/bf79505e-9fc2-41fc-b3e4-bf30cd1e2ca5">
<img width="793" alt="image" src="https://github.com/aneeshseth/editors.com/assets/122401851/ff6a045a-399f-40f1-9157-68ef2fff7166">


Tech Stack Used:

- Typescript
- Prisma (ORM)
- ExpressJS
- PostgreSQL
- Docker
- Zod
- Recoil (State Management)
- NextJS 13
- ShadCN/ui
- FFmpeg (Video Transcoding)
  
