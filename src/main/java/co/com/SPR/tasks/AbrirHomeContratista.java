package co.com.SPR.tasks;

import co.com.SPR.userinterface.HomeContratista;
import cucumber.api.java.bs.A;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

public class AbrirHomeContratista implements Task {

    HomeContratista homeContratista;

    public static AbrirHomeContratista elhome(){ return Tasks.instrumented(AbrirHomeContratista.class);}

    @Override
    public <T extends Actor> void performAs(T actor){actor.attemptsTo(Open.browserOn(homeContratista));}
}
