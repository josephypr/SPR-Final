package co.com.SPR.tasks;

import co.com.SPR.userinterface.HomeContratista;
import co.com.SPR.userinterface.PerfilContratista;
import net.serenitybdd.screenplay.Actor;
import net.serenitybdd.screenplay.Task;
import net.serenitybdd.screenplay.Tasks;
import net.serenitybdd.screenplay.actions.Open;

public class AbrirPerfil implements Task {

    PerfilContratista perfilContratista;
    public static AbrirPerfil elperfil() {
        return Tasks.instrumented(AbrirPerfil.class);
    }
    @Override
    public <T extends Actor> void performAs(T actor){actor.attemptsTo(Open.browserOn(perfilContratista));}
}
