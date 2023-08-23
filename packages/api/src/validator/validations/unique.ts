
// import * as Models from '../../models';

// export default (data, field, message, args, get) => {
//   return new Promise((resolve, reject) => {
//     const modelName = args[0];
//     const fieldName = args[1] || field;
//     const idName = args[2];
//     let alterField = args[3];
//     let idValue = null;

//     const model = Models[modelName];
//     if (!model) {
//       throw new Error(`Model ${modelName} not found`);
//     }

//     const fieldValue = get(data, field);
//     if (!fieldValue) {
//       resolve();
//     }

//     if (idName) {
//       idValue = get(data, idName);
//       if (idValue === null) {
//         reject(`Value for ${idName} is null`);
//       }
//       if (!alterField) {
//         alterField = idName;
//       }
//     }

//     model.query()
//       .where(fieldName, fieldValue)
//       .first()
//       .then((instance: any) => {
//         if (instance) {
//           if (!idName || (idName && instance[alterField] !== (idValue * 1))) {
//             reject(`${modelName} with ${fieldName} equal to ${fieldValue} already exists`);
//           }
//         }
//         resolve();
//       })
//       .catch((error: Error) => reject(error));
//   });
// };
