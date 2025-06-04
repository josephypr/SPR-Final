package co.com.SPR.tasks;

import co.com.SPR.userinterface.PerfilContratista;
import net.serenitybdd.screenplay.*;
import net.serenitybdd.screenplay.actions.Open;

public class AbrirPerfil implements Task {

    PerfilContratista perfilContratista;
    public static Performable elperfil() {
        return Tasks.instrumented(AbrirPerfil.class);
    }
    @Override
    public <T extends Actor> void performAs(T actor){actor.attemptsTo(Open.browserOn(perfilContratista));}
}
