# CoopScout
### A superior FRC scouting experience


## Requirements (google sheets version):
- A recent node version (I developed coopscout using v17.6.0)
- A google sheet with two subsheets entitled: "coopscout" and "priorityList"
- A google drive [service account](https://cloud.google.com/iam/docs/creating-managing-service-accounts)

## Setup
- Clone the repo (`git clone https://github.com/meechapooch/coopscout`)
- Create a secrets folder
  - api/secrets
    └─ [client_secret.json](https://stackoverflow.com/questions/65816603/how-to-generate-client-secret-json-for-google-api-with-offline-access)
    └─ env.js
- `cd` into "api" and npm install
- node run index.js `node .`
- hurrah! coopscout is now hosting on [localhost:3001/]



## Examples
api/secrets/env.js
```js
export const env = {
    sheet_id:'1dSi5K_aM6juwvV4-QMXHt7pd5Hha9wixq_9V73zdax4',
}
```
