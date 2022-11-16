/* University
 *
 * Class: University
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * */

#include "university.hh"

University::University():running_number_(111111)
{
}

University::~University()
{
    for ( auto course : courses_ ){
        delete course.second;
    }

    for ( auto account : accounts_ ){
        delete account.second;
    }

}

// Function checks if the course already exist and add course if not
// Parameters:
// params = given words
void University::add_course(Params params)
{
    if ( courses_.find(params.at(0)) != courses_.end() ){
        std::cout << ALREADY_EXISTS << std::endl;
        return;

    } else {
        std::cout << NEW_COURSE << std::endl;
    }

    Course* n_course = new Course(params.at(0), params.at(1));
    courses_.insert({n_course->get_code(), n_course});
}

// Function prints courses' code and name
// Parameters:
// params = given words
void University::print_courses(Params)
{
    for ( auto course : courses_ ){
        course.second->print_info(true);
    }
}

// Function prints course's name, code and instance
// Parameters:
// params = given words
// Return:
void University::print_course(Params params)
{
    if ( courses_.find(params.at(0)) == courses_.end() ){
        std::cout << CANT_FIND << params.at(0) << std::endl;
        return;
    }

    courses_.at(params.at(0))->print_long_info();
}

// Function adds account and gives account number
// Parameters:
// params = given words
// Return:
void University::add_account(Params params)
{
    for( std::map<int, Account*>::iterator iter = accounts_.begin();
         iter != accounts_.end(); ++iter ) {
        if( iter->second->get_email() == params.at(1) ) {
            std::cout << ALREADY_EXISTS << std::endl;
            return;
        }
    }

    // account number always increases by one
    int account_number = running_number_++;
    Account* n_account = new Account(params.at(0), params.at(1), account_number);
    accounts_.insert({account_number, n_account});
    std::cout << NEW_ACCOUNT << std::endl;
    n_account->print();
}

// Function prints accounts' number, name and email
// Parameters:
// params = given words
void University::print_accounts(Params)
{
    for ( auto account : accounts_ ){
        account.second->print();
    }
}

// Function prints account's number, name and email
// Return:
void University::print_account_info(Params params)
{
    std::map<int, Account*>::iterator iter = accounts_.find(std::stoi(params.at(0)));
    if ( iter == accounts_.end() ){
        std::cout << CANT_FIND << params.at(0) << std::endl;
        return;
    }
    iter->second->print();
}

// Function adds staff to course if course and account exist
// Parameters:
// params = given words
// Return:
void University::add_staff_to_course(Params params)
{
    if ( courses_.find(params.at(0)) == courses_.end() ){
        std::cout << CANT_FIND << params.at(0) << std::endl;
        return;
    }
    if ( accounts_.find(std::stoi(params.at(1))) == accounts_.end() ){
        std::cout << CANT_FIND << params.at(1) << std::endl;
        return;
    }
    courses_.at(params.at(0))->add_staff(accounts_.at(std::stoi(params.at(1))));
}

// Function adds intance to the course
// Parameters:
// params = given words
void University::add_instance(Params params)
{
    if ( courses_.find( params.at(0) ) != courses_.end() ){
        if ( not courses_.at( params.at(0) )->has_instance( params.at(1)) ){

            // Intances starting date
            Date* date = new Date(utils::today.get_day(), utils::today.get_month(),
                                 utils::today.get_year());

            // New instance and its infomation
            Instance* instance = new Instance( params.at(1), date, courses_.at(params.at(0)));

            courses_.at( params.at(0) )->new_instance(instance);

        } else {
            std::cout << INSTANCE_EXISTS << std::endl;
        }
    } else {
        std::cout << CANT_FIND << params.at(0) << std::endl;
    }
}

// Function adds student to courses instance if it's possible
// Parameters:
// params = given words
void University::sign_up_on_course(Params params)
{
    if ( is_parameter_known(params) ){

        Instance* inst = courses_.at( params.at(0) )->get_instance( params.at(1) );

        // This day is taken down
        Date* today = new Date(utils::today.get_day(), utils::today.get_month(),
                               utils::today.get_year());

        if ( inst->is_possible_add_staff( accounts_.at( std::stoi(params.at(2))), today ) ){
            accounts_.at( std::stoi(params.at(2)) )->add_instance( inst );
        }
    }
}

// Function transfers course to completed
// Parameters:
// params = given words
void University::complete_course(Params params)
{
    if ( is_parameter_known( params ) ){
        accounts_.at( std::stoi(params.at(2)) )->instance_completed( courses_.at(params.at(0))
                                    ->get_instance( params.at(1) ), courses_.at(params.at(0) ) );
    }
}

// Function prints all signups for every instance
// Parameters:
// params = given words
void University::print_signups(Params params)
{
    if ( courses_.find( params.at(0) ) == courses_.end() ){
        std::cout << CANT_FIND << params.at(0) << std::endl;

    } else {
        courses_.at(params.at(0))->print_signups();
    }
}

// Function prints student's current and completed courses and credits
// Parameters:
// params = given words
void University::print_study_state(Params params)
{
    if ( accounts_.find( std::stoi(params.at(0)) ) != accounts_.end() ){
        accounts_.at( std::stoi(params.at(0)) )->print_study_state();

    } else {
        std::cout << CANT_FIND << params.at(0) << std::endl;
    }
}

// Function prints student's completed courses and credits
// Parameters:
// params = given words
void University::print_completed(Params params)
{
    if ( accounts_.find( std::stoi(params.at(0)) ) != accounts_.end() ){
        accounts_.at( std::stoi(params.at(0)) )->print_completed();

    } else {
        std::cout << CANT_FIND << params.at(0) << std::endl;
    }
}

// Function set date
// Parameters:
// params = given numbers
void University::set_date(Params params)
{
    utils::today = Date(std::stoi(params.at(0)), std::stoi(params.at(1)), std::stoi(params.at(2)));
    std::cout << "Date has been set to ";
    utils::today.print();
    std::cout << std::endl;
}

// Function moves current day by given amount
// Parameters:
// params = given numbers
void University::advance_date(Params params)
{
    utils::today.advance_by(std::stoi(params.at(0)));
    std::cout << "New date is ";
    utils::today.print();
    std::cout << std::endl;
}

// Function moves current day by period
// Parameters:
// params = given numbers
void University::advance_by_period(Params)
{
    utils::today.advance_by_period_length();
    std::cout << "New date is ";
    utils::today.print();
    std::cout << std::endl;
}

// Function checks if courses code, instance and account number are found
// Parameters:
// params = given words
// Return:
// false = parameter is unknown
// true = known
bool University::is_parameter_known(Params params)
{
    if ( courses_.find( params.at(0) ) != courses_.end() ){
        if ( courses_.at( params.at(0) )->has_instance( params.at(1) )){
            if ( accounts_.find( std::stoi(params.at(2)) ) != accounts_.end() ){
                return true;

            } else {
                std::cout << CANT_FIND << params.at(2) << std::endl;
                return false;
            }
        } else {
            std::cout << CANT_FIND << params.at(1) << std::endl;
            return false;
        }
    } else {
        std::cout << CANT_FIND << params.at(0) << std::endl;
        return false;
    }
}




