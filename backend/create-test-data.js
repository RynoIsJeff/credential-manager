const { default: mongoose } = require("mongoose");
const Division = require("./models/Division");
const OU = require("./models/OU");
const CredentialRepository = require("./models/CredentialRepository");
mongoose.connect('mongodb+srv://vdwryno:Ryno2003@hyperiondev-ryno.m62yslk.mongodb.net/credential-manager?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  createTestData();
})
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
const createTestData = async () => {
  try {
    // Delete existing data
    await OU.deleteMany({});
    await Division.deleteMany({});
    await CredentialRepository.deleteMany({});

    const ouNames = ['News Management', 'Software Reviews', 'Hardware Reviews', 'Opinion Publishing'];
    const divisionNames = ['Finances', 'IT', 'Writing', 'Development'];

    for (const ouName of ouNames) {
      const ou = new OU({ name: ouName });
      await ou.save();

      const divisions = [];

      for (const divisionName of divisionNames) {
        const division = new Division({ name: divisionName, ou: ou._id });
        await division.save();
        divisions.push(division);

        const credentialRepository = new CredentialRepository({
          name: 'Test Credential Repository',
          divisionId: division._id,
        });
        await credentialRepository.save();
      }

      ou.divisions = divisions;
      await ou.save();
    }

    console.log('Test data created successfully');
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    mongoose.disconnect();
  }
};

