package co.com.SPR.tasks;


import co.com.SPR.userinterface.HomePrestador;
import cucumber.api.java.bs.A;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

public class AbrirHomePrestador implements Task{
    HomePrestador homePrestador;

    public static AbrirHomePrestador elhome(){ return Tasks.instrumented(AbrirHomePrestador.class);}

    @Override
    public <T extends Actor> void performAs(T actor){actor.attemptsTo(Open.browserOn(homePrestador));}
}
