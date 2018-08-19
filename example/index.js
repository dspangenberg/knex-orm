import Company from './models/company';
import Employee from './models/employee';
import rqliteAdapter from '../src/rqlite';
/*
Company.where({ rank: 3 }).orderBy('name').then((res) => {
  console.log(res);
});
*/


async function test() {
  rqliteAdapter.seeds();



  const famousCompany = new Company({
    name: 'A Really Famous Company',
    email: 'info@famouscompany.example',
  });

  //await famousCompany.save();

  console.log(Company.query()
    .withRelated('employees')
    .orderBy('name')
    .where('companyId', 1)
    .first().toString());
  console.log(Employee.query()
    .where({ id: 3 })
    .withRelated('company')
    .toString()
  );

  const companies = await Company.query()
    .withRelated('employees')
    .orderBy('name')
  console.log('Companies:');
  console.dir(companies);

  const employee = await Employee.query()
    .where({ id: 3 })
    .withRelated('company');
  console.log('Employee:');
  console.log(employee);
}

test();

// console.log(Company.where({ id: 3 }).toString());

/* Company.where({ rank: 3 }).then((company) => {
  console.log(company);
}); */

/*
console.log(Employee.first().withRelated('company').toString());
console.log(Company.first().withRelated('employee').toString());
console.log();

Employee.withRelated('company').then((employee) => {
  console.log('Employee:');
  console.log(employee);
  console.log();
});

Company.first().withRelated('employee').then((company) => {
  console.log('Company:');
  console.log(company);
  console.log();
});

// The 2 lines below equal to Employee.withRelated('company')
Database.knex.from('employees')
  .join('companies', 'employees.company_id', 'companies.rank')
  .select('companies.*')
  .then((employee) => {
    console.log('Knex employee:');
    console.log(employee);
  });
*/
