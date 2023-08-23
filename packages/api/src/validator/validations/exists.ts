
// import * as Models from '../../models';

// export default (data, field, message, args, get) => {
//   return new Promise((resolve, reject) => {
//     const modelName = args[0];
//     const fieldName = args[1] || 'id';

//     const model = Models[modelName];
//     if (!model) {
//       throw new Error(`Model ${modelName} not found`);
//     }

//     const fieldValue = get(data, field);
//     if (!fieldValue) {
//       resolve();
//     }

//     model.query()
//       .where(fieldName, fieldValue)
//       .first()
//       .then((instance: any) => {
//         if (!instance) {
//           reject(`${modelName} with ${fieldName} equal to ${fieldValue} does not exist`);
//         }
//         resolve();
//       })
//       .catch((error: Error) => reject(error));
//   });
// };
