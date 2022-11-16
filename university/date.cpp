/* University
 *
 * Class: Date
 *
 * Program author
 * Name: Julia Harttunen
 * Student number: 291740
 * UserID: mqjuha
 * E-Mail: julia.harttunen@tuni.fi
 *
 * Notes: Code was already exists and I haven't done any changes,
 * only added comments
 *
 * */

#include "date.hh"
#include <iostream>

Date::Date(unsigned int day, unsigned int month, unsigned int year):
    day_(day), month_(month), year_(year)
{
    if ( month_ > 12 || month_ < 1){
        month_ = 1;
    }
    if ( day_ > month_sizes[month_ - 1]
         || (month_ == 2 && is_leap_year()
             && day > month_sizes[month - 1 ] + 1) ){
        day_ = 1;
    }

}

Date::~Date()
{

}

// Function moves date by period
void Date::advance_by_period_length()
{
    advance_by(PERIOD_LENGTH);
}

// Function moves date
// Parameters:
// days = number how many days
void Date::advance_by(unsigned int days)
{
    day_ = day_ + days;
    while ( day_ > month_sizes[month_ - 1] ){
        if ( month_ == 2 && day_ == 29 ){
            return;
        }
        day_ = day_ - month_sizes[month_ - 1];
        if ( month_ == 2 && is_leap_year() ){
            day_--;
        }
        month_++;

        if ( month_ > 12 ){
            month_ = month_ - 12;
            year_++;
        }
    }
}

// Function prints date
void Date::print() const
{
    std::cout << day_ << "." << month_ << "." << year_;
}

// Function gets day
// Return:
// day
unsigned int Date::get_day() const
{
    return day_;
}

// Function gets month
// Return:
// month
unsigned int Date::get_month() const
{
    return month_;
}

// Function gets year
// Return:
// year
unsigned int Date::get_year() const
{
    return year_;
}

// Function compares current date and starting date if they are same
// Parameters:
// rhs = starting date
// Return:
// days, months and years numbers
bool Date::operator==(const Date &rhs) const
{
    return day_ == rhs.day_ && month_ == rhs.month_ && year_ == rhs.year_ ;
}

// Function compares current date and starting date if starting date is bigger
// Parameters:
// rhs = starting date
// Return:
// days, months and years numbers in one big amount
bool Date::operator<(const Date &rhs) const
{
    return (year_ * 10000 + month_ * 100 + day_ ) <
            ( rhs.year_ * 10000 + rhs.month_ * 100 + rhs.day_);
}

// Function checks is leap year
bool Date::is_leap_year() const
{
    return (year_ % 4 == 0) && (!(year_ % 100 == 0) || (year_ % 400 == 0));
}

