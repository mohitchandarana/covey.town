import db from './knexfile';

export type TownData = {
  coveyTownID: string,
  coveyTownPassword: string,
  friendlyName: string,
  isPublicallyListed: boolean,
};

export type AllTownResponse = {
  coveyTownID: string,
};

export type TownListingInfo = {
  coveyTownID: string,
  friendlyName: string,
};

export type SavedTownListingInfo = {
  coveyTownID: string,
  friendlyName: string,
  publicStatus: boolean,
};

export type UserInfo = {
  email: string,
  firstName: string,
  lastName: string,
  currentAvatar: string,
};

type User = {
  email: string,
};

type Avatar = {
  currentAvatar: string,
};

// functions interacting with Users
export async function logUser(email: string): Promise<void>  {
  let count = 0;
  await db('Users')
    .where('email', email)
    .then((rows: User[]) => {
      count = rows.length;
    });

  if (count === 0) {
    await db('Users')
      .insert({
        'email': email,
        'currentAvatar': 'misa',
        'firstName': ' ',
        'lastName': ' ',
      });
  }
}

export async function getAllUserInfo(email: string): Promise<UserInfo> {
  return db('Users')
    .where('email', email)
    .then((rows: UserInfo[]) => {
      const user = rows[0];
      return { email: user.email, firstName: user.firstName, lastName: user.lastName, currentAvatar: user.currentAvatar };
    });
}

export async function setUserNames(email: string, firstName?: string, lastName?: string): Promise<void> {
  
  if (firstName || lastName) {
    await db('Users')
      .where('email', email)
      .update({
        'firstName': firstName,
        'lastName': lastName,
      });
  }
}

export async function deleteUser(email: string): Promise<void> {
  await db('Users')
    .where('email', email)
    .del();

}

// Functions interacting with Towns
export async function getPublicTowns(): Promise<TownListingInfo[]> {
  const results: TownListingInfo[] = [];
  await db('Towns')
    .select('coveyTownID', 'friendlyName')
    .where('isPublicallyListed', true)
    .then((rows: TownListingInfo[]) => {
      rows.forEach(row => results.push({ coveyTownID: row.coveyTownID, friendlyName: row.friendlyName }));
    });
  return results;
}

export async function getAllTowns(): Promise<AllTownResponse[]> {
  const results: AllTownResponse[] = [];
  await db('Towns')
    .select('coveyTownID')
    .then((rows: AllTownResponse[]) => {
      rows.forEach(row => results.push({ coveyTownID: row.coveyTownID }));
    });
  return results;
}

export async function getTownByID(townID: string): Promise<TownData | void> {
  const result = await db('Towns')
    .select('coveyTownID', 'coveyTownPassword', 'friendlyName', 'isPublicallyListed')
    .where('coveyTownID', townID)
    .then((rows: TownData[]) => {
      const row = rows[0];
      let town;
      if (row !== undefined) {
        town = {

          coveyTownID: row.coveyTownID,
          coveyTownPassword: row.coveyTownPassword,
          friendlyName: row.friendlyName,
          isPublicallyListed: row.isPublicallyListed,
        };
      }
      return town;
    });
  return result;
}

export async function addNewTown(townID: string, password: string, friendlyName: string, isPublicallyListed: boolean, email: string): Promise<void> {

  await db('Towns')
    .insert([{
      'coveyTownID': townID,
      'coveyTownPassword': password,
      'friendlyName': friendlyName,
      'isPublicallyListed': isPublicallyListed,
      'creator': email,
    }]);

}

export async function updateTownName(townID: string, password: string, friendlyName: string): Promise<void> {
  await db('Towns')
    .where('coveyTownID', townID)
    .andWhere('coveyTownPassword', password)
    .update({
      'friendlyName': friendlyName,
    });
}

export async function updateTownPublicStatus(townID: string, password: string, isPublicallyListed: boolean): Promise<void> {
  await db('Towns')
    .where('coveyTownID', townID)
    .andWhere('coveyTownPassword', password)
    .update({
      'isPublicallyListed': isPublicallyListed,
    });
}

export async function deleteTown(townID: string, password: string): Promise<void> {
  await db('Towns')
    .where('coveyTownID', townID)
    .andWhere('coveyTownPassword', password)
    .del();
}

// functions interacting with saved towns
export async function saveTown(user: string, townID: string): Promise<void> {
  // check if town aready saved
  const savedTown = await db('SavedTowns')
    .where('coveyTownID', townID)
    .where('userEmail', user);

  if (savedTown !== undefined) {
    await db('SavedTowns')
      .insert({
        'coveyTownID': townID,
        'userEmail': user,
      });
  }
}

export async function unsaveTown(user: string, townID: string): Promise<void> {
  await db('SavedTowns')
    .where('userEmail', user)
    .andWhere('coveyTownID', townID)
    .del();
}

// export async function getSavedTowns(user: string): Promise<SavedTownListingInfo[]> {
//   return db('SavedTowns')
//     .innerJoin('Towns', 'SavedTowns.coveyTownID', 'Towns.coveyTownID')
//     .select('Towns.coveyTownID as townID', 'Towns.friendlyName as friendlyName', 'Towns.isPublicallyListed as publicStatus')
//     .where('Savedtowns.userEmail', user)
//     .then((returnedTowns: any[]) => {
//       const townList: SavedTownListingInfo[] = [];
//       returnedTowns.forEach(town => {
//         townList.push({ coveyTownID: town.townID, friendlyName: town.friendlyName, publicStatus: town.publicStatus});
//       });
//       return townList;
//     });
// }

export async function getSavedTowns(user: string): Promise<SavedTownListingInfo[]> {
  return db('Towns')
    .leftJoin('SavedTowns', 'Towns.coveyTownID', 'SavedTowns.coveyTownID')
    .select('Towns.coveyTownID as coveyTownID', 'Towns.friendlyName as friendlyName', 'Towns.isPublicallyListed as publicStatus')
    .where('SavedTowns.userEmail', user)
    .then((returnedTowns: SavedTownListingInfo[]) => {
      const townList: SavedTownListingInfo[] = [];
      returnedTowns.forEach(town => {
        townList.push({ coveyTownID: town.coveyTownID, friendlyName: town.friendlyName, publicStatus: town.publicStatus});
      });
      return townList;
    });
}

// functions interacting with avatars
export async function updateAvatar(user: string, avatar: string): Promise<void> {
  await db('Users')
    .where('email', user)
    .update({
      'currentAvatar': avatar,
    });
}

export async function getCurrentAvatar(user: string): Promise<string> {
  return db('Users')
    .select('currentAvatar')
    .where('email', user)
    .then((rows: Avatar[]) => {
      const response = rows[0];
      return response.currentAvatar;
    });
}

