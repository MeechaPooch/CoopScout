# CoopScout
### 1540's superior FRC scouting experience
<img width="300" alt="coopscout demo" src="https://user-images.githubusercontent.com/55720333/162840941-03113d1d-d1d4-4782-9a5a-c95979207049.gif">
<img width="200" alt="coopscout logo" src="https://user-images.githubusercontent.com/55720333/162840776-c2d9c5ab-4bb6-4370-a68b-fb5301e98de6.png">

## Setup Part 1 (server specs/google sheet)
- Get your hands on a server running a recent node version (I developed coopscout using v17.6.0)
- Make a google sheets document with two sheets entitled: "coopscout" and "priorityList"
- Create a google drive [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts)

## Setup Part 2 (server)
- Clone the repo (`git clone https://github.com/meechapooch/coopscout`)
- Create a secrets folder
  - api/secrets
    └─ [client_secret.json](https://stackoverflow.com/questions/65816603/how-to-generate-client-secret-json-for-google-api-with-offline-access)
    └─ env.js
- `cd` into "api" and `npm install`
- node run index.js `node .`
- hurrah! coopscout is now hosting on [localhost:3001](http://localhost:3001)


## Examples
pwa on homescreen:

<img width="300" alt="yeetus feetus" src="https://user-images.githubusercontent.com/55720333/162842871-48c57f67-86f8-4d06-b71d-75f11d99f013.PNG">


data spreadsheet:

<img width="1245" alt="example data" src="https://user-images.githubusercontent.com/55720333/162841995-b9a43179-d4dc-40be-a566-e1f181996251.png">

api/secrets/env.js
```js
export const env = {
    sheet_id:'1dSi5K_aM6juwvV4-QMXHt7pd5Hha9wixq_9V73zdax4',
}
```
