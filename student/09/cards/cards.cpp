#include "cards.hh"

// TODO: Implement the methods here
using namespace std;

Cards::Cards(): top_(nullptr){
}

Cards::~Cards(){
    Card_data* tmp = top_;
    while ( tmp != nullptr ) {
        top_ = top_->next;
        delete tmp;
        tmp = top_;
    }
}

// Adds a new card with the given id as the topmost element.
void Cards::add(int id){
    if(top_ == nullptr){
        top_ = new Card_data{id, nullptr};
        return;
    }
    Card_data* tmp = new Card_data{id, top_};
    top_ = tmp;
}

// Prints the content of the data structure with ordinal numbers to the
// output stream given as a parameter starting from the last element.
void Cards::print_from_bottom_to_top(std::ostream& s){
    recursive_print(top_, s);
}

// Prints the content of the data structure with ordinal numbers to the
// output stream given as a parameter starting from the first element.
void Cards::print_from_top_to_bottom(std::ostream& s){
    Card_data* item_to_be_printed = top_;
    int running_number = 1;
    while ( item_to_be_printed != nullptr ) {
        s << running_number << ": " << item_to_be_printed->data << endl;
        ++running_number;
       item_to_be_printed = item_to_be_printed->next;
    }
}

// Removes the topmost card and passes it in the reference parameter id.
// Returns false, if the data structure is empty, otherwise returns true.
bool Cards::remove(int& id){
    if(top_ == nullptr){
        return false;
    }
    id = top_->data;
    Card_data* new_top = top_->next;
    delete top_;
    top_ = new_top;
    return true;
}

// Moves the last element of the data structure as the first one.
// Returns false, if the data structure is empty, otherwise returns true.
bool Cards::bottom_to_top(){
    if(top_ == nullptr || top_->next == nullptr){
        return false;
    }
    Card_data* last = top_;
    while (last->next != nullptr) {
       last = last->next;
    }
    Card_data* new_last = top_;
    while(new_last->next->next != nullptr){
        new_last = new_last->next;
    }
    new_last->next = nullptr;
    last->next = top_;
    top_ = last;
    return true;
}

// Moves the first element of the data structure as the last one.
// Returns false, if the data structure is empty, otherwise returns true.
bool Cards::top_to_bottom(){
    if(top_ == nullptr || top_->next == nullptr){
        return false;
    }
    Card_data* new_top = top_->next;
    Card_data* last = top_;
    while(last->next->next != nullptr){
        last = last->next;
    }
    top_->next = nullptr;
    last->next->next = top_;
    top_ = new_top;
    return true;
}

// You can use the function below in the implementation of
// the method print_from_bottom_to_top.
int Cards::recursive_print(Card_data* top, std::ostream& s){
    if(top == nullptr){
        return 1;
    }
    int running_number = recursive_print(top->next, s);
    s << running_number << ": " << top->data << endl;
     return running_number +1;
}



