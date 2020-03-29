#include "cards.hh"

using namespace std;

Cards::Cards(): top_(nullptr){
}

void Cards::add(int id){

    if ( top_ == nullptr ) {
        top_ = new Card_data{id, nullptr};
        return;
    }
    Card_data* tmp = new Card_data{id, top_};
    top_ = tmp;
}

void Cards::print_from_top_to_bottom(ostream& s){

    Card_data* tmp = top_;
    int counter = 1;

    while ( tmp != nullptr ) {
        s << counter << ": " << tmp->data << endl;
        ++counter;
        tmp = tmp->next;
    }

}

bool Cards::remove(int& id){

    if (top_ == nullptr){
        return false;
    }
    id = top_->data;
    Card_data* new_top = top_->next;

    delete top_;
    top_ = new_top;
    return true;
}

bool Cards::bottom_to_top(){

    if (top_ == nullptr || top_->next== nullptr){
        return false;
    }
    Card_data* last = top_;

    while (last->next != nullptr){
        last = last->next;
    }
    Card_data* new_last = top_;

    while(new_last->next != nullptr){
        new_last = new_last->next;

    }
    new_last->next = nullptr;
    last->next = top_;
    top_ = last;
    return true;
}

bool Cards::top_to_bottom(){

    if(top_  == nullptr || top_->next == nullptr){
        return false;
    }
    Card_data* new_top = top_->next;

    Card_data* last = top_;
    while(last->next->next != nullptr){
        last = last->next;
    }

    top_->next = nullptr;
    last->next = top_;

    top_ = new_top;
    return true;

}

void Cards::print_from_bottom_to_top(ostream &s)
{
   recursive_print(top_, s);
}

Cards::~Cards()
{
    Card_data* tmp = top_;
    while(tmp != nullptr){
        top_ = top_->next;
        delete tmp;
        tmp = top_;
    }
}

int Cards::recursive_print(Cards::Card_data *top, ostream &s)
{
    if(top == nullptr){
        return 1;

    }
    int running_number = recursive_print(top->next, s);
    s << running_number << ": " << top->data << endl;

    return running_number + 1;
}


