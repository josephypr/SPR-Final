package co.com.SPR.stepsdefinitions;


import co.com.SPR.tasks.Postulacion;
import cucumber.api.java.es.Cuando;
import cucumber.api.java.es.Entonces;

import static net.serenitybdd.screenplay.actors.OnStage.theActorInTheSpotlight;

public class PostulacionPrestadorStepDefinitions {
    @Cuando("^Cuando el usuario oprima el campo de postularse$")
    public void cuandoElUsuarioOprimaElCampoDePostularse() {
        theActorInTheSpotlight().attemptsTo((Postulacion.aUnaOferta()));

    }


    @Cuando("^el usuario se encuentre en home y vaya al apartado de prestador y haga click en el campo postularse$")
    public void elUsuarioSeEncuentreEnHomeYVayaAlApartadoDePrestadorYHagaClickEnElCampoPostularse() {

    }

    @Entonces("^el usuario podra visualizar toda su informacion personal en la postulacion\\.$")
    public void elUsuarioPodraVisualizarTodaSuInformacionPersonalEnLaPostulacion() {

    }

}
